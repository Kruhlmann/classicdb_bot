import { MonoRegexHTMLTooltipBodyParser } from ".";

export class DurabilityParser extends MonoRegexHTMLTooltipBodyParser<number> {
    protected readonly pattern = /Durability (\d+) \/ \d+/;
    protected readonly default_value = -1;

    protected postformat(parse_result: string[]): number {
        return Number.parseInt(parse_result[1]);
    }
}
