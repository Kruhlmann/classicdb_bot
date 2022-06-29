import { Writeable } from "../../io/writable/writable";
import { Logger } from "../logger";
import { OutputDeviceLoggerOptions } from "../options";
import { Preformatter } from "../preformatter/preformatter";
import { TerminalColorCode } from "../terminal_color_codes";

export abstract class OutputDeviceLogger<WriteableResult = void | Promise<void>> implements Logger<WriteableResult> {
    public readonly output_device: Writeable<WriteableResult>;
    public readonly preformatter: Preformatter;
    public readonly options: OutputDeviceLoggerOptions;

    public constructor(
        output_device: Writeable<WriteableResult>,
        preformatter: Preformatter,
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
