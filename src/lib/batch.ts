export type BatchCallback<T = any> = (data?: T[] | undefined) => void;
export type OnProcessCallback<T = any> = ((data?: T[], reason?: string) => void) | undefined;

interface BatchProcessOptions {
  maxTime?: number;
  maxSize?: number;
  onProcess?: OnProcessCallback;
}

// a simple queue to batch process data at a given interval
export class BatchProcess {
  private queue: any[] = [];

  private callback: BatchCallback;
  private queued: NodeJS.Timeout | null = null;

  private maxTime: number;
  private maxSize: number;
  private onProcess: OnProcessCallback;

  constructor(
    callback: BatchCallback,
    { maxTime = 5000, maxSize = Infinity, onProcess }: BatchProcessOptions
  ) {
    this.callback = callback;
    this.queued = null;

    this.maxTime = maxTime;
    this.maxSize = maxSize;
    this.onProcess = onProcess;
  }

  add(data: any) {
    this.queue.push(data);

    if (this.queue.length >= this.maxSize) {
      if (this.queued) clearTimeout(this.queued);

      this.process('maxSize');
    } else if (!this.queued) {
      this.queued = setTimeout(() => this.process(), this.maxTime);
    }
  }

  async process(reason = 'maxTime') {
    if (typeof this.callback === 'function') await this.callback(this.queue);
    if (typeof this.onProcess === 'function') await this.onProcess(this.queue, reason);

    this.queue = [];
    this.queued = null;
  }
}
