import * as cheerio from "cheerio";

import { Parser } from ".";

export class ClassicDBClassParser extends Parser<string[]> {
    public async parse(): Promise<string[]> {
        const $ = cheerio.load(this.page_html_source);
        const classes: string[] = [];
        $("div.tooltip font").each((_, class_node) => {
            const element = $(class_node);
            classes.push(element.text());
        });
        return classes;
    }
}

export class TBCDBClassParser extends Parser<string[]> {
    public static class_pattern = /<br \/>\s*?Classes: (.*?)\s*?<br \/>/;

    public async parse(): Promise<string[]> {
        const class_regex_matches = this.page_html_source.match(TBCDBClassParser.class_pattern);
        if (!class_regex_matches || class_regex_matches.length < 2) {
            return [];
        }
        const classes = class_regex_matches[1].split(",");
        const trimmed_classes = classes.map((class_name) => {
            return class_name.trim();
        });
        return trimmed_classes;
    }
}
