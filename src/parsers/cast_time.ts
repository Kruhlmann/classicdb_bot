import { MonoRegexHTMLTooltipBodyParser } from ".";

export class CastTimeParser extends MonoRegexHTMLTooltipBodyParser<number> {
    protected readonly pattern = /([\d.]+ sec cast|Instant)/;
    protected readonly default_value = 0;

    public postformat(parse_result: string[]): number {
        if (parse_result[1] === "Instant") {
            return this.default_value;
        }
        return Number.parseFloat(parse_result[1]);
    }
}
