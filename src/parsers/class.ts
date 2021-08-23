import * as cheerio from "cheerio";

import { LookupTable } from "../lookup_table";
import { HTMLParser } from ".";

export enum Class {
    NONE,
    WARRIOR,
    PRIEST,
    SHAMAN,
    PALADIN,
    HUNTER,
    ROGUE,
    MAGE,
    WARLOCK,
    DRUID,
}

export class ClassLookupTable extends LookupTable<Class> {
    protected readonly lookup_table = {
        [""]: Class.NONE,
        warrior: Class.WARRIOR,
        priest: Class.PRIEST,
        shaman: Class.SHAMAN,
        paladin: Class.PALADIN,
        hunter: Class.HUNTER,
        rogue: Class.ROGUE,
        mage: Class.MAGE,
        warlock: Class.WARLOCK,
        druid: Class.DRUID,
    };
    protected default_value = Class.NONE;
}

export class ClassicDBClassParser extends HTMLParser<Class[]> {
    public parse(): Class[] {
        const $ = cheerio.load(this.page_html_source);
        const classes: string[] = [];
        $("div.tooltip font").each((_, class_node) => {
            const element = $(class_node);
            classes.push(element.text());
        });
        const class_lookup_table = new ClassLookupTable();
        return classes.map((cls_string) => class_lookup_table.perform_lookup(cls_string));
    }
}

export class TBCDBClassParser extends HTMLParser<Class[]> {
    public static class_pattern = /<br \/>\s*?Classes: (.*?)\s*?<br \/>/;

    // eslint-disable-next-line complexity
    public parse(): Class[] {
        const class_regex_matches = this.page_html_source.match(TBCDBClassParser.class_pattern);
        if (!class_regex_matches || class_regex_matches.length < 2) {
            return [];
        }
        const classes = class_regex_matches[1].split(",");
        const trimmed_classes = classes.map((class_name) => {
            return class_name.trim();
        });
        const class_lookup_table = new ClassLookupTable();
        return trimmed_classes.map((cls_string) => class_lookup_table.perform_lookup(cls_string));
    }
}
