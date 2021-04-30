export class Logger {
    private readonly prefix: string;

    constructor(prefix = '') {
        this.prefix = prefix;
    }

    log(...data: unknown[]): void {
        console.log(...this.addPrefix(data));
    }

    info(...data: unknown[]): void {
        console.info(...this.addPrefix(data));
    }

    warn(...data: unknown[]): void {
        console.warn(...this.addPrefix(data));
    }

    error(...data: unknown[]): void {
        console.error(...this.addPrefix(data));
    }

    private addPrefix(data: unknown[]): unknown[] {
        if (this.prefix === '') return data;

        if (typeof data[0] === 'string') {
            return [this.prefix + data[0], ...data.slice(1)];
        } else {
            return [this.prefix, ...data];
        }
    }
}
