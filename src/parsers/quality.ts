import * as cheerio from "cheerio";

import { LookupTable } from "../lookup_table";
import { HTMLParser } from ".";

export enum ItemQuality {
    POOR,
    COMMON,
    UNCOMMON,
    RARE,
    EPIC,
    LEGENDARY,
    ARTIFACT,
    HEIRLOOM,
}

export enum ItemQualityColor {
    POOR = "#9d9d9d",
    COMMON = "#ffffff",
    UNCOMMON = "#1eff00",
    RARE = "#0070dd",
    EPIC = "#a335ee",
    LEGENDARY = "#ff8000",
    ARTIFACT = "#e6cc80",
    HEIRLOOM = "#00ccff",
}

export class ItemQualityLookupTable extends LookupTable<ItemQuality> {
    protected readonly lookup_table = {
        poor: ItemQuality.POOR,
        common: ItemQuality.COMMON,
        uncommon: ItemQuality.UNCOMMON,
        rare: ItemQuality.RARE,
        epic: ItemQuality.EPIC,
        legendary: ItemQuality.LEGENDARY,
        artifact: ItemQuality.ARTIFACT,
        heirloom: ItemQuality.HEIRLOOM,
    };
    protected readonly default_value: ItemQuality.POOR;
}

export class ItemQualityColorLookupTable extends LookupTable<ItemQualityColor> {
    protected readonly lookup_table = {
        [ItemQuality.POOR]: ItemQualityColor.POOR,
        [ItemQuality.COMMON]: ItemQualityColor.COMMON,
        [ItemQuality.UNCOMMON]: ItemQualityColor.UNCOMMON,
        [ItemQuality.RARE]: ItemQualityColor.RARE,
        [ItemQuality.EPIC]: ItemQualityColor.EPIC,
        [ItemQuality.LEGENDARY]: ItemQualityColor.LEGENDARY,
        [ItemQuality.ARTIFACT]: ItemQualityColor.ARTIFACT,
        [ItemQuality.HEIRLOOM]: ItemQualityColor.HEIRLOOM,
    };
    protected readonly default_value: ItemQualityColor.POOR;
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
        q7: ItemQuality.HEIRLOOM,
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
