import { Writeable } from "../io/writable/writable";
import { Preformatter } from "./preformatter/preformatter";

export interface Logger<WriteResult = void | Promise<void>> {
    output_device: Writeable<WriteResult>;
    preformatter: Preformatter;
    log(buffer: string): void;
    warning(buffer: string): void;
    debug(buffer: string): void;
    error(buffer: string): void;
}
