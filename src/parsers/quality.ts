import * as cheerio from "cheerio";

import { HTMLParser } from ".";

export class QualityParser extends HTMLParser<string> {
    public static css_class_quality_lookup_table: Record<string, string> = {
        q0: "poor",
        q1: "common",
        q2: "uncommon",
        q3: "rare",
        q4: "epic",
        q5: "legendary",
        q6: "artifact",
        q7: "blizzard",
    };

    public async parse(): Promise<string> {
        const $ = cheerio.load(this.page_html_source);
        const name_node = $("div.tooltip table tr td table tr td b").first();
        return this.name_node_to_quality_string($(name_node));
    }

    private name_node_to_quality_string(name_node: cheerio.Cheerio): string {
        const name_node_css_class = name_node.attr("class");
        return QualityParser.css_class_quality_lookup_table[name_node_css_class] || "";
    }
}
