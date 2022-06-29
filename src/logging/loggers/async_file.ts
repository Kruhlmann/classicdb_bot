import { AsynchronousWriteableFile } from "../../io/writable/file/async";
import { Preformatter } from "../preformatter/preformatter";
import { OutputDeviceLogger } from "./output_device";

export class AsynchronousFileOutputLogger extends OutputDeviceLogger<Promise<boolean | void>> {
    public constructor(
        path: string,
        preformatter: Preformatter,
        debug = true,
        log = true,
        warning = true,
        error = true,
    ) {
        super(new AsynchronousWriteableFile(path), preformatter, debug, log, warning, error);
    }
}
