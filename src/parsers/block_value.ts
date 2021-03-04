import { HTMLTooltipBodyParser } from ".";

export class BlockValueParser extends HTMLTooltipBodyParser<number> {
    public static readonly block_pattern = /([0-9]+) Block/;
    public static readonly no_block_value = -1;

    public async parse(): Promise<number> {
        const block_value_pattern_match = this.tooltip_table_html.match(BlockValueParser.block_pattern);
        if (!block_value_pattern_match || block_value_pattern_match.length < 2) {
            return BlockValueParser.no_block_value;
        }
        const block_value_string = block_value_pattern_match[1];
        return parseInt(block_value_string);
    }
}
