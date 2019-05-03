import * as cheerio from "cheerio";
import * as request from "request-promise";
import * as config from "../../config.json";
import { handle_exception } from "../io.js";
import { SetBonus } from "../typings/types.js";
import { Effect } from "./effect";
import { Item } from "./item";

/**
 * @fileoverview Class definition for ItemSet.
 * @author Andreask Kruhlmann
 * @since 1.2.0
 */

export class ItemSet {
    public static async from_id(itemset_id: string): Promise<void | ItemSet> {
        return ItemSet.from_url(`${config.host}/?itemset=${itemset_id}`);
    }

    public static async from_url(url: string): Promise<void | ItemSet> {
        return request(url).then((html: string) => {
            const $ = cheerio.load(html);
            const main_content = $("div#main div#main-contents div.text");

            const name = main_content.find("h1").first().text();
            const items: Item[] = [];
            const set_bonuses: SetBonus[] = [];

            main_content.find(".iconlist tbody").find("tr").each(async (rw) => {
                const id = $(rw)
                    .find("td span a")
                    .attr("href")
                    .replace("?item=", "");
                items.push(await Item.from_id(id) as Item);
            });

            main_content.find("ul").first().find("li").each((list_item) => {
                const id = $(list_item)
                    .find("a").first()
                    .attr("href")
                    .replace("?spell=", "");
                const pieces_required = $(list_item).text().charAt(0);
                const effect = Effect.from_id(id) as Effect;
                set_bonuses.push({pieces_required, effect});
            });

            return new ItemSet(name, items, set_bonuses);
        }).catch((error) => handle_exception(error));
    }

    public name: string;
    public items: Item[];
    public set_bonuses: SetBonus[] ;

    /**
     * Constructor.
     *
     * @constructor
     * @param {string} name - Name of item set.
     * @param {Item[]} items - Items included in this set.
     * @param {SetBonus[]} set_bonuses - Set bonuses, which apply for this item
     * set.
     */
    public constructor(name: string, items: Item[], set_bonuses: SetBonus[]) {
        this.name = name;
        this.items = items;
        this.set_bonuses = set_bonuses;
    }

}
