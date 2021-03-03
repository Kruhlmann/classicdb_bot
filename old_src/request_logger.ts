import * as fs from "fs";

export class RequestLogger {
    private filestream: fs.WriteStream;
    private requests_since_last_write: number = 0;

    public constructor(filename: string, interval_ms: number) {
        this.filestream = fs.createWriteStream(filename);
        setInterval(this.write, interval_ms);
    }

    public register_request_recieved(): void {
        this.requests_since_last_write++;
    }

    private write(): void {
        this.filestream.write(`${this.requests_since_last_write}\n`);
        this.requests_since_last_write = 0;
    }
}
