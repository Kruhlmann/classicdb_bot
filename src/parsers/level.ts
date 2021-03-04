import { HTMLTooltipBodyParser } from ".";

export class LevelRequirementParser extends HTMLTooltipBodyParser<number> {
    public static readonly level_requirement_pattern = /Requires Level ([0-9]+)/;
    public static readonly no_level_requirement = -1;

    public async parse(): Promise<number> {
        const level_requirement_pattern_match = this.tooltip_table_html.match(
            LevelRequirementParser.level_requirement_pattern
        );
        if (!level_requirement_pattern_match || level_requirement_pattern_match.length < 2) {
            return LevelRequirementParser.no_level_requirement;
        }
        const level_requirement_string = level_requirement_pattern_match[1];
        return parseInt(level_requirement_string);
    }
}
