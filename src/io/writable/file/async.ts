import * as fs from "fs";
import { AsynchronousWriteable } from "../async";

export class AsynchronousWriteableFile implements AsynchronousWriteable {
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
