import * as fs from "fs";

interface IWriteable {
    write(buffer: string | Uint8Array): boolean | void | Promise<void>;
}

export interface ISynchronousWriteable {
    write(buffer: string | Uint8Array): boolean | void;
}

export interface IAsynchronousWriteable {
    write(buffer: string | Uint8Array): Promise<boolean> | Promise<void>;
}

export interface IPreformatter {
    preformat(buffer: string): string;
}

export interface ILoggable {
    output_device: IWriteable;
    preformatter: IPreformatter;
    log(buffer: string): void;
    warning(buffer: string): void;
    debug(buffer: string): void;
    error(buffer: string): void;
}

export class ISODatePreformatter implements IPreformatter {
    public preformat(buffer: string): string {
        const now = new Date();
        return `[${now.toISOString()}] ${buffer}\n`;
    }
}

export class SynchronousWriteableFile implements ISynchronousWriteable {
    protected readonly path: string;

    public constructor(path: string) {
        this.path = path;
    }

    public write(buffer: string): void {
        fs.appendFileSync(this.path, buffer);
    }
}

export class AsynchronousWriteableFile implements IAsynchronousWriteable {
    protected readonly path: string;

    public constructor(path: string) {
        this.path = path;
    }

    public async write(buffer: string): Promise<void> {
        return new Promise((resolve) => {
            fs.appendFile(this.path, buffer, () => resolve());
        });
    }
}

export abstract class OutputDeviceLogger implements ILoggable {
    public readonly output_device: IWriteable;
    public readonly preformatter: IPreformatter;

    public constructor(output_device: IWriteable, preformatter: IPreformatter) {
        this.output_device = output_device;
        this.preformatter = preformatter;
    }

    public debug(buffer: string): void {
        const preformatted_buffer = this.preformatter.preformat(buffer);
        this.output_device.write(`[D] ${preformatted_buffer}`);
    }

    public log(buffer: string): void {
        const preformatted_buffer = this.preformatter.preformat(buffer);
        this.output_device.write(`[I] ${preformatted_buffer}`);
    }

    public warning(buffer: string): void {
        const preformatted_buffer = this.preformatter.preformat(buffer);
        this.output_device.write(`[W] ${preformatted_buffer}`);
    }

    public error(buffer: string): void {
        const preformatted_buffer = this.preformatter.preformat(buffer);
        this.output_device.write(`[E] ${preformatted_buffer}`);
    }
}

export class STDOutputLogger extends OutputDeviceLogger {
    public constructor(preformatter: IPreformatter) {
        super(process.stdout, preformatter);
    }
}

export class SynchronousFileOutputLogger extends OutputDeviceLogger {
    public constructor(path: string, preformatter: IPreformatter) {
        super(new SynchronousWriteableFile(path), preformatter);
    }
}

export class AsynchronousFileOutputLogger extends OutputDeviceLogger {
    public constructor(path: string, preformatter: IPreformatter) {
        super(new AsynchronousWriteableFile(path), preformatter);
    }
}
