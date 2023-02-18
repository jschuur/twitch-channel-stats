// a simple queue to batch process data at a given interval
export default class BatchProcess {
    queue = [];
    callback;
    queued = null;
    maxTime;
    maxSize;
    onProcess;
    constructor(callback, { maxTime = 5000, maxSize = Infinity, onProcess }) {
        this.callback = callback;
        this.queued = null;
        this.maxTime = maxTime;
        this.maxSize = maxSize;
        this.onProcess = onProcess;
    }
    add(data) {
        this.queue.push(data);
        if (this.queue.length >= this.maxSize) {
            if (this.queued)
                clearTimeout(this.queued);
            this.process('maxSize');
        }
        else if (!this.queued) {
            this.queued = setTimeout(() => this.process(), this.maxTime);
        }
    }
    async process(reason = 'maxTime') {
        if (typeof this.callback === 'function')
            await this.callback(this.queue);
        if (typeof this.onProcess === 'function')
            await this.onProcess(this.queue, reason);
        this.queue = [];
        this.queued = null;
    }
}
