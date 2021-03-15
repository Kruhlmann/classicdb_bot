import * as cheerio from "cheerio";

import { HTMLParser } from ".";
import { LookupTable } from "../lookup_table";

class CSSClassQualityLookupTable extends LookupTable<string> {
    protected readonly lookup_table = {
        q0: "poor",
        q1: "common",
        q2: "uncommon",
        q3: "rare",
        q4: "epic",
        q5: "legendary",
        q6: "artifact",
        q7: "blizzard",
    };
    protected readonly default_value: "poor";
}

export class QualityParser extends HTMLParser<string> {
    public parse(): string {
        const $ = cheerio.load(this.page_html_source);
        const name_node = $("div.tooltip table tr td table tr td b").first();
        return this.name_node_to_quality_string($(name_node));
    }

    private name_node_to_quality_string(name_node: cheerio.Cheerio): string {
        const name_node_css_class = name_node.attr("class");
        return new CSSClassQualityLookupTable().perform_lookup(name_node_css_class) || "";
    }
}
