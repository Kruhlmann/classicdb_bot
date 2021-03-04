import * as cheerio from "cheerio";

import { HTMLParser } from ".";

export class ArmorValueParser extends HTMLParser<number> {
    public static readonly armor_pattern = /([0-9]+) Armor/;
    public static readonly no_armor_value = -1;

    public async parse(): Promise<number> {
        const $ = cheerio.load(this.page_html_source);
        const armor_container_html = $("div.tooltip table tr td table tr td").html();
        const armor_pattern_match = armor_container_html.match(ArmorValueParser.armor_pattern);
        if (!armor_pattern_match || armor_pattern_match.length < 2) {
            return ArmorValueParser.no_armor_value;
        }
        const armor_value_string = armor_pattern_match[1];
        return parseInt(armor_value_string);
    }
}
