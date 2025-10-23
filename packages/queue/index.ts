// Queue package
export interface QueueOptions {
  concurrency?: number;
  retries?: number;
  retryDelay?: number;
}

export interface QueueJob<T = any> {
  id: string;
  data: T;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  processedAt?: Date;
  failedAt?: Date;
  error?: string;
}

export type JobProcessor<T = any> = (job: QueueJob<T>) => Promise<void>;

export class Queue<T = any> {
  private jobs: QueueJob<T>[] = [];
  private processing = new Set<string>();
  private processors: JobProcessor<T>[] = [];
  private options: Required<QueueOptions>;

  constructor(options: QueueOptions = {}) {
    this.options = {
      concurrency: options.concurrency || 1,
      retries: options.retries || 3,
      retryDelay: options.retryDelay || 1000,
    };
  }

  add(data: T, options: Partial<QueueOptions> = {}): string {
    const job: QueueJob<T> = {
      id: this.generateId(),
      data,
      attempts: 0,
      maxAttempts: options.retries || this.options.retries,
      createdAt: new Date(),
    };
    
    this.jobs.push(job);
    this.processJobs();
    
    return job.id;
  }

  addProcessor(processor: JobProcessor<T>): void {
    this.processors.push(processor);
  }

  private async processJobs(): Promise<void> {
    if (this.processing.size >= this.options.concurrency) {
      return;
    }

    const job = this.jobs.find(j => 
      !this.processing.has(j.id) && 
      j.attempts < j.maxAttempts
    );

    if (!job) {
      return;
    }

    this.processing.add(job.id);
    job.attempts++;
    job.processedAt = new Date();

    try {
      for (const processor of this.processors) {
        await processor(job);
      }
      this.removeJob(job.id);
    } catch (error) {
      job.failedAt = new Date();
      job.error = error instanceof Error ? error.message : String(error);
      
      if (job.attempts >= job.maxAttempts) {
        this.removeJob(job.id);
      } else {
        // Retry after delay
        setTimeout(() => {
          this.processing.delete(job.id);
          this.processJobs();
        }, this.options.retryDelay);
      }
    }

    this.processing.delete(job.id);
    this.processJobs(); // Process next job
  }

  private removeJob(id: string): void {
    const index = this.jobs.findIndex(j => j.id === id);
    if (index !== -1) {
      this.jobs.splice(index, 1);
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  getStats(): {
    total: number;
    processing: number;
    failed: number;
    completed: number;
  } {
    const processing = this.processing.size;
    const failed = this.jobs.filter(j => j.attempts >= j.maxAttempts).length;
    const completed = this.jobs.length - failed - processing;
    
    return {
      total: this.jobs.length,
      processing,
      failed,
      completed,
    };
  }
}

// Global queue instance
export const globalQueue = new Queue();

// Utility functions
export function addJob<T>(data: T, options?: QueueOptions): string {
  return globalQueue.add(data, options);
}

export function processJobs<T>(processor: JobProcessor<T>): void {
  globalQueue.addProcessor(processor);
}