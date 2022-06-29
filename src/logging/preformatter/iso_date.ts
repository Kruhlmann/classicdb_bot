import { Preformatter } from "./preformatter";

export class ISODatePreformatter implements Preformatter {
    public preformat(buffer: string): string {
        const now = new Date();
        return `[${now.toISOString()}] ${buffer}\n`;
    }
}
