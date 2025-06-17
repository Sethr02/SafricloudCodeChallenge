export class JobQueue {
    // Set up the queue with some safety limits. You can customize:
    // - How many jobs can run at once
    // - How many jobs can start per minute
    // - How long each job can take before timing out
    constructor(options = {}) {
        this.activeJobs = 0;
        this.queue = [];
        this.isDisposed = false;
        this.jobStartTimes = [];
        // Validate inputs
        if (options.concurrencyLimit !== undefined && options.concurrencyLimit <= 0) {
            throw new Error('concurrencyLimit must be greater than 0');
        }
        if (options.rateLimit !== undefined && options.rateLimit <= 0) {
            throw new Error('rateLimit must be greater than 0');
        }
        if (options.timeoutLimit !== undefined && options.timeoutLimit <= 0) {
            throw new Error('timeoutLimit must be greater than 0');
        }
        this.concurrencyLimit = options.concurrencyLimit ?? 1000;
        this.rateLimit = options.rateLimit ?? Infinity;
        this.timeoutLimit = (options.timeoutLimit ?? 1200) * 1000;
    }
    // Add a new job to the queue. Will return info about:
    // - The actual result from the job
    // - How long it waited in line
    // - How long it took to run
    async schedule(fn, ...args) {
        if (this.isDisposed) {
            throw new Error('Queue has been disposed');
        }
        const queueStartTime = Date.now();
        return new Promise((resolve, reject) => {
            const job = async () => {
                await this.enforceRateLimit();
                await this.executeJob(fn, args, queueStartTime, resolve, reject);
            };
            this.queue.push({ resolve, reject, job });
            this.processNextJob();
        });
    }
    async executeJob(fn, args, queueStartTime, resolve, reject) {
        const startTime = Date.now();
        const queueTime = startTime - queueStartTime;
        try {
            const result = await this.executeWithTimeout(fn, args);
            const executionTime = Date.now() - startTime;
            resolve({
                result,
                queueTime,
                executionTime,
            });
        }
        catch (error) {
            reject(error);
        }
        finally {
            this.activeJobs--;
            this.processNextJob();
        }
    }
    async executeWithTimeout(fn, args) {
        return Promise.race([
            fn(...args),
            new Promise((_, timeoutReject) => setTimeout(() => timeoutReject(new Error('Job timed out')), this.timeoutLimit)),
        ]);
    }
    // Makes sure we don't start too many jobs too quickly
    // Waits if needed to stay under the rate limit
    async enforceRateLimit() {
        if (this.rateLimit === Infinity)
            return;
        const now = Date.now();
        this.jobStartTimes = this.jobStartTimes.filter(time => now - time < 60000);
        if (this.jobStartTimes.length >= this.rateLimit) {
            const oldestStart = this.jobStartTimes[0];
            const waitTime = 60000 - (now - oldestStart);
            if (waitTime > 0) {
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        }
        this.jobStartTimes.push(now);
    }
    // Checks if we can start new jobs and starts them if possible
    // Keeps running jobs up to the concurrency limit
    processNextJob() {
        if (this.queue.length === 0 || this.activeJobs >= this.concurrencyLimit) {
            return;
        }
        const next = this.queue.shift();
        if (next) {
            this.activeJobs++;
            next.job().catch((error) => {
                console.error('Job execution failed:', error);
            });
        }
    }
    // Counter for how many jobs are waiting in line
    size() {
        return this.queue.length;
    }
    // Counter for how many jobs are currently running
    active() {
        return this.activeJobs;
    }
    // Clean up everything and reject any remaining jobs
    // Use this when you're done with the queue
    dispose() {
        this.isDisposed = true;
        const error = new Error('Queue has been disposed');
        while (this.queue.length > 0) {
            const job = this.queue.shift();
            job?.reject(error);
        }
    }
}
