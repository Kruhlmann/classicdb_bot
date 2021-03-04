import * as cheerio from "cheerio";

import { HTMLParser } from ".";

abstract class NameParser extends HTMLParser<string> {
    public async parse(): Promise<string> {
        const $ = cheerio.load(this.page_html_source);
        const name_node = $("div.text > h1").first();
        const name = name_node.text();
        return this.postformat(name);
    }

    public abstract postformat(name: string): string;
}

export class ClassicDBNameParser extends NameParser {
    public postformat(name: string): string {
        return name.replace(/ \(.*?\)/, "");
    }
}

export class TBCDBNameParser extends NameParser {
    public postformat(name: string): string {
        return name;
    }
}
