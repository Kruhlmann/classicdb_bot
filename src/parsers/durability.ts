import { MonoRegexHTMLTooltipBodyParser } from ".";

export class DurabilityParser extends MonoRegexHTMLTooltipBodyParser<number> {
    protected readonly pattern = /Durability ([0-9]+) \/ [0-9]+/;
    protected readonly default_value = -1;

    protected postformat(parse_result: string[]): number {
        return parseInt(parse_result[1]);
    }
}