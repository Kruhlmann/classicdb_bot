import { Writeable } from "./writable";

export interface AsynchronousWriteable extends Writeable<Promise<void>> {}
