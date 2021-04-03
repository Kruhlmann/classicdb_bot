import * as fs from "fs";

export type OutputDeviceLoggerOptions = {
    debug: boolean;
    log: boolean;
    warning: boolean;
    error: boolean;
};

export interface IWriteable {
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
    public readonly options: OutputDeviceLoggerOptions;

    public constructor(
        output_device: IWriteable,
        preformatter: IPreformatter,
        debug = true,
        log = true,
        warning = true,
        error = true,
    ) {
        this.output_device = output_device;
        this.preformatter = preformatter;
        this.options = { debug, log, warning, error };
    }

    public debug(buffer: string): void {
        if (!this.options.debug) {
            return;
        }
        const preformatted_buffer = this.preformatter.preformat(buffer);
        this.output_device.write(`[D] [${this.get_caller_filename()}] ${preformatted_buffer}`);
    }

    public log(buffer: string): void {
        if (!this.options.log) {
            return;
        }
        const preformatted_buffer = this.preformatter.preformat(buffer);
        this.output_device.write(`[I] [${this.get_caller_filename()}] ${preformatted_buffer}`);
    }

    public warning(buffer: string): void {
        if (!this.options.warning) {
            return;
        }
        const preformatted_buffer = this.preformatter.preformat(buffer);
        this.output_device.write(`[W] [${this.get_caller_filename()}] ${preformatted_buffer}`);
    }

    public error(buffer: string): void {
        if (!this.options.error) {
            return;
        }
        const preformatted_buffer = this.preformatter.preformat(buffer);
        this.output_device.write(`[E] [${this.get_caller_filename()}] ${preformatted_buffer}`);
    }

    protected get_caller_filename(): string {
        try {
            const raw_stack = new Error("-").stack;
            // 3rd item in the call stack is the one just outside this call.
            const latest_stack_call = raw_stack.split(/ at/)[3];
            // Grab contents of parenthesis.
            const filename_path = /\((.*?)\)/.exec(latest_stack_call)[1];
            // Grab filename from full file path.
            const filename = filename_path.split("/").slice(-1)[0];
            return filename;
        } catch {
            return "unknown_file";
        }
    }
}

export class STDOutputLogger extends OutputDeviceLogger {
    public constructor(preformatter: IPreformatter) {
        super(process.stdout, preformatter);
    }
}

export class SynchronousFileOutputLogger extends OutputDeviceLogger {
    public constructor(
        path: string,
        preformatter: IPreformatter,
        debug = true,
        log = true,
        warning = true,
        error = true,
    ) {
        super(new SynchronousWriteableFile(path), preformatter, debug, log, warning, error);
    }
}

export class AsynchronousFileOutputLogger extends OutputDeviceLogger {
    public constructor(
        path: string,
        preformatter: IPreformatter,
        debug = true,
        log = true,
        warning = true,
        error = true,
    ) {
        super(new AsynchronousWriteableFile(path), preformatter, debug, log, warning, error);
    }
}
