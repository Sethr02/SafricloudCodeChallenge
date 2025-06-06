export interface JobQueueOptions {
    concurrencyLimit?: number;
    rateLimit?: number;
    timeoutLimit?: number;
}

export interface JobResult<T> {
    result: T;
    queueTime: number;
    executionTime: number;
}
