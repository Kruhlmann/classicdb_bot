import * as cheerio from "cheerio";

import { Parser } from ".";

export class UniqueParser extends Parser<boolean> {
    public static readonly bind_on_pickup = "Binds when picked up";
    public static readonly bind_on_equip = "Binds when equipped";

    public async parse(): Promise<boolean> {
        const $ = cheerio.load(this.page_html_source);
        const unique_container_html = $("div.tooltip table tr td table tr td").html();
        return unique_container_html.includes("Unique");
    }
}
