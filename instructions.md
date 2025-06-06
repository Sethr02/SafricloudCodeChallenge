# Job Queue Implementation Challenge

## Overview

In this coding challenge, you will implement a job queue module in TypeScript that manages asynchronous jobs with configurable concurrency, rate limiting, and timeout capabilities. This challenge aims to assess your skills in:

- TypeScript implementation
- Asynchronous programming with Promises
- Resource management
- Error handling
- Testing methodologies
- Project organization

## Requirements

### Core Functionality

Implement a `JobQueue` class with the following features:

#### Constructor
```typescript
new JobQueue(options?: JobQueueOptions)
```

The constructor should accept an optional configuration object with the following properties:
- `concurrencyLimit`: Maximum number of jobs that can run simultaneously (default: 1000)
- `rateLimit`: Maximum number of jobs that can start per minute (default: unlimited)
- `timeoutLimit`: Maximum time in seconds that each job has to complete (default: 1200 seconds)

#### Methods

1. **schedule**
   ```typescript
   schedule<T>(fn: (...args: any[]) => Promise<T>, ...args: any[]): Promise<JobResult<T>>
   ```
   - Schedule a job for execution
   - `fn` is an asynchronous function that will be executed
   - `args` are optional arguments to pass to the function
   - Returns a Promise that resolves with a `JobResult<T>` containing:
     - `result`: The value returned by the job function
     - `queueTime`: The time in milliseconds the job waited in the queue
     - `executionTime`: The time in milliseconds it took to execute the job

2. **size**
   ```typescript
   size(): number
   ```
   - Returns the current number of jobs waiting in the queue (not yet started)

3. **active**
   ```typescript
   active(): number
   ```
   - Returns the current number of jobs being executed

4. **dispose**
   ```typescript
   dispose(): void
   ```
   - Rejects all remaining promises in the queue
   - Cleans up any resources used by the queue

### Behavior Requirements

Your implementation must satisfy the following requirements:

1. **FIFO Processing**: Jobs should be executed in the order they were added to the queue (first in, first out).

2. **Concurrency Control**: The queue should limit the number of jobs running simultaneously based on the `concurrencyLimit` option.

3. **Rate Limiting**: The queue should limit the number of jobs started per minute based on the `rateLimit` option.

4. **Timeout Handling**: Jobs that exceed their time limit should be rejected with a timeout error.

5. **Error Propagation**: When a job fails or times out, the promise returned by `schedule()` should be rejected with the original error (if available).

## Testing Requirements

Create a comprehensive test suite that demonstrates:

1. Basic job scheduling and successful completion
2. Error handling (failed jobs)
3. Queue size and active count tracking
4. Concurrency limit functionality
5. Rate limiting functionality
6. Job timeout behavior
7. FIFO execution order
8. Proper disposal behavior

Do not use external testing libraries. Implement a simple test framework using native Node.js features.

## Technical Constraints

1. **Language**: TypeScript with Node.js
2. **Dependencies**: Avoid using non-native packages
3. **Module System**: Use ES modules (ESM)
4. **Project Structure**:
   - Source code in `./src` directory
   - Compiled output in `./dist` directory
5. **Build & Test**:
   - `npm run test` should build the code and run the tests
   - Test results should be displayed in the terminal

## Deliverables

1. Complete TypeScript implementation of the `JobQueue` class
2. Complete TypeScript implementation of a verbose test suite covering the core functionality of the class
3. README.md file that explains:
   - How to use the class and its methods
   - Examples of usage
4. Properly configured package.json and tsconfig.json
5. A GitHub repository containing your solution

## Evaluation Criteria

Your solution will be evaluated based on:

1. **Correctness**: Does it satisfy all the requirements?
2. **Code Quality**: Is the code well-structured, readable, and maintainable?
3. **Error Handling**: How well does it handle edge cases and errors?
4. **Testing**: Is the test suite comprehensive and effective?
5. **Documentation**: Is the code well-documented and is the README clear and complete?

## Submission

Please publish your code to GitHub and share the repository link with us. Ensure the repository is public or that you have granted access to the reviewers.

Good luck!