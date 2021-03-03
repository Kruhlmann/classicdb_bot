import * as cheerio from "cheerio";

import { Parser } from ".";

export enum ItemBinding {
    ON_PICKUP,
    ON_EQUIP,
    NONE,
}

export class BindingParser extends Parser<ItemBinding> {
    public static readonly bind_on_pickup = "Binds when picked up";
    public static readonly bind_on_equip = "Binds when equipped";

    public async parse(): Promise<ItemBinding> {
        const $ = cheerio.load(this.page_html_source);
        const binding_container_html = $("div.tooltip table tr td table tr td").html();

        if (binding_container_html.includes(BindingParser.bind_on_pickup)) {
            return ItemBinding.ON_PICKUP;
        }
        if (binding_container_html.includes(BindingParser.bind_on_equip)) {
            return ItemBinding.ON_EQUIP;
        }
        return ItemBinding.NONE;
    }
}
