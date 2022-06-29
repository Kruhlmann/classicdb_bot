import * as fs from "fs";
import { SynchronousWriteable } from "../sync";

export class SynchronousWriteableFile implements SynchronousWriteable {
    protected readonly path: string;

    public constructor(path: string) {
        this.path = path;
    }

    public write(buffer: string): void {
        fs.appendFileSync(this.path, buffer);
    }
}
