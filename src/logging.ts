import * as fs from "fs";

enum TerminalColorCode {
    RESET = "\u001B[0m",
    BRIGHT = "\u001B[1m",
    DIM = "\u001B[2m",
    UNDERSCORE = "\u001B[4m",
    BLINK = "\u001B[5m",
    REVERSE = "\u001B[7m",
    HIDDEN = "\u001B[8m",
    FGBLACK = "\u001B[30m",
    FGRED = "\u001B[31m",
    FGGREEN = "\u001B[32m",
    FGYELLOW = "\u001B[33m",
    FGBLUE = "\u001B[34m",
    FGMAGENTA = "\u001B[35m",
    FGCYAN = "\u001B[36m",
    FGWHITE = "\u001B[37m",
    BGBLACK = "\u001B[40m",
    BGRED = "\u001B[41m",
    BGGREEN = "\u001B[42m",
    BGYELLOW = "\u001B[43m",
    BGBLUE = "\u001B[44m",
    BGMAGENTA = "\u001B[45m",
    BGCYAN = "\u001B[46m",
    BGWHITE = "\u001B[47m",
}

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
        const prefix = `${TerminalColorCode.FGCYAN}[D]${TerminalColorCode.RESET}`;
        this.output_device.write(`${prefix} [${this.get_caller_filename()}] ${preformatted_buffer}`);
    }

    public log(buffer: string): void {
        if (!this.options.log) {
            return;
        }
        const prefix = `${TerminalColorCode.FGWHITE}[I]${TerminalColorCode.RESET}`;
        const preformatted_buffer = this.preformatter.preformat(buffer);
        this.output_device.write(`${prefix} [${this.get_caller_filename()}] ${preformatted_buffer}`);
    }

    public warning(buffer: string): void {
        if (!this.options.warning) {
            return;
        }
        const prefix = `${TerminalColorCode.FGYELLOW}[W]${TerminalColorCode.RESET}`;
        const preformatted_buffer = this.preformatter.preformat(buffer);
        this.output_device.write(`${prefix} [${this.get_caller_filename()}] ${preformatted_buffer}`);
    }

    public error(buffer: string): void {
        if (!this.options.error) {
            return;
        }
        const prefix = `${TerminalColorCode.FGRED}[E]${TerminalColorCode.RESET}`;
        const preformatted_buffer = this.preformatter.preformat(buffer);
        this.output_device.write(`${prefix} [${this.get_caller_filename()}] ${preformatted_buffer}`);
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
