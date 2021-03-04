import { RegexHTMLTooltipBodyParser } from ".";

export class ArmorValueParser extends RegexHTMLTooltipBodyParser<number> {
    protected readonly pattern = /([0-9]+) Armor/;
    protected readonly default_value = -1;

    protected postformat(parse_result: string[]): number {
        return parseInt(parse_result[1]);
    }
}
