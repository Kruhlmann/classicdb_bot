import { Preformatter } from "../preformatter/preformatter";
import { OutputDeviceLogger } from "./output_device";

export class STDOutputLogger extends OutputDeviceLogger<void> {
    public constructor(preformatter: Preformatter) {
        super(process.stdout, preformatter);
    }
}
