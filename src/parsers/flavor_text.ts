import * as cheerio from "cheerio";

import { HTMLParser } from ".";

export class FlavorTextParser extends HTMLParser<string> {
    public async parse(): Promise<string> {
        const $ = cheerio.load(this.page_html_source);
        const flavor_text = $("span.q").first().text();
        return flavor_text || "";
    }
}
