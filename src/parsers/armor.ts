import { MonoRegexHTMLTooltipBodyParser } from ".";

export class ArmorValueParser extends MonoRegexHTMLTooltipBodyParser<number> {
    protected readonly pattern = /(\d+) Armor/;
    protected readonly default_value = -1;

    protected postformat(parse_result: string[]): number {
        return Number.parseInt(parse_result[1]);
    }
}
