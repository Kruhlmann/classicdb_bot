import * as cheerio from "cheerio";

import { HTMLParser } from ".";
import { LookupTable } from "../lookup_table";

export enum ItemQuality {
    POOR,
    COMMON,
    UNCOMMON,
    RARE,
    EPIC,
    LEGENDARY,
    ARTIFACT,
    BLIZZARD,
}

class CSSClassQualityLookupTable extends LookupTable<ItemQuality> {
    protected readonly lookup_table = {
        q0: ItemQuality.POOR,
        q1: ItemQuality.COMMON,
        q2: ItemQuality.UNCOMMON,
        q3: ItemQuality.RARE,
        q4: ItemQuality.EPIC,
        q5: ItemQuality.LEGENDARY,
        q6: ItemQuality.ARTIFACT,
        q7: ItemQuality.BLIZZARD,
    };
    protected readonly default_value: ItemQuality.POOR;
}

export class QualityParser extends HTMLParser<ItemQuality> {
    public parse(): ItemQuality {
        const $ = cheerio.load(this.page_html_source);
        const name_node = $("div.tooltip table tr td table tr td b").first();
        return this.name_node_to_quality_string($(name_node));
    }

    private name_node_to_quality_string(name_node: cheerio.Cheerio): ItemQuality {
        const name_node_css_class = name_node.attr("class");
        return new CSSClassQualityLookupTable().perform_lookup(name_node_css_class) || ItemQuality.POOR;
    }
}
