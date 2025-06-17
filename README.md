# Job Queue Implementation

A TypeScript implementation of a job queue with concurrency control, rate limiting, and timeout functionality.

## Features

- Concurrent job execution with configurable limits
- Rate limiting to control jobs per minute
- Job timeout protection
- Queue statistics tracking
- Proper cleanup with dispose method

## Running Tests

```bash
# Install dependencies
npm install

# Run all tests
npm test
```

The test suite includes:
- Unit tests for queue operations
- Concurrency limit tests
- Rate limiting tests
- Timeout functionality tests
- Edge case handling

## Usage

```typescript
import { JobQueue } from './src/JobQueue.js';

// Create a queue with custom options
const queue = new JobQueue({
    concurrencyLimit: 5,    // Max 5 jobs at once
    rateLimit: 60,         // Max 60 jobs per minute
    timeoutLimit: 30       // 30 second timeout
});

// Schedule a job
try {
    const result = await queue.schedule(async () => {
        // Your async work here
        return 'success';
    });
    
    console.log('Job completed:', result);
    console.log('Queue time:', result.queueTime);
    console.log('Execution time:', result.executionTime);
} catch (error) {
    console.error('Job failed:', error);
}

// Clean up when done
queue.dispose();
```

## API Reference

### Constructor Options

- `concurrencyLimit`: Maximum number of jobs running simultaneously (default: 1000)
- `rateLimit`: Maximum number of jobs that can start per minute (default: Infinity)
- `timeoutLimit`: Maximum time in seconds for each job (default: 1200)

### Methods

- `schedule<T>(fn: () => Promise<T>): Promise<JobResult<T>>`: Add a new job to the queue
- `size(): number`: Get number of queued jobs
- `active(): number`: Get number of currently running jobs
- `dispose(): void`: Clean up the queue and reject remaining jobs
