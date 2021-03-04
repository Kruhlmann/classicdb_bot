import { HTMLTooltipBodyParser } from ".";

export class BlockValueParser extends HTMLTooltipBodyParser<number> {
    public static readonly block_pattern = /([0-9]+) Block/;
    public static readonly no_block_value = -1;

    public async parse(): Promise<number> {
        const armor_pattern_match = this.tooltip_table_html.match(BlockValueParser.block_pattern);
        if (!armor_pattern_match || armor_pattern_match.length < 2) {
            return BlockValueParser.no_block_value;
        }
        const armor_value_string = armor_pattern_match[1];
        return parseInt(armor_value_string);
    }
}
