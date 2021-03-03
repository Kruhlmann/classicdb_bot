import * as cheerio from "cheerio";

import { Parser } from ".";

export class FlavorTextParser extends Parser<string> {
    public async parse(): Promise<string> {
        const $ = cheerio.load(this.page_html_source);
        const flavor_text = $("span.q").first().text();
        return flavor_text || "";
    }
}
