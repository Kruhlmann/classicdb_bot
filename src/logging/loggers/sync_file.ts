import { SynchronousWriteableFile } from "../../io/writable/file/sync";
import { Preformatter } from "../preformatter/preformatter";
import { OutputDeviceLogger } from "./output_device";

export class SynchronousFileOutputLogger extends OutputDeviceLogger<boolean | void> {
    public constructor(
        path: string,
        preformatter: Preformatter,
        debug = true,
        log = true,
        warning = true,
        error = true,
    ) {
        super(new SynchronousWriteableFile(path), preformatter, debug, log, warning, error);
    }
}
