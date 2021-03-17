import { MonoRegexHTMLTooltipBodyParser } from ".";

export class RangeParser extends MonoRegexHTMLTooltipBodyParser<number> {
    protected readonly pattern = /(\d+ yd|Melee) [Rr]ange/;
    protected readonly default_value = -1;

    public postformat(parse_result: string[]): number {
        if (parse_result[1] === "Melee") {
            return 0;
        }
        return Number.parseInt(parse_result[1]);
    }
}
