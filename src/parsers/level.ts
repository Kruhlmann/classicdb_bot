import { RegexHTMLTooltipBodyParser } from ".";

export class LevelRequirementParser extends RegexHTMLTooltipBodyParser<number> {
    protected readonly pattern = /Requires Level ([0-9]+)/;
    protected readonly default_value = -1;

    protected postformat(parse_result: string[]): number {
        return parseInt(parse_result[1]);
    }
}
