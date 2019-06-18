import * as cheerio from "cheerio";
import * as request from "request-promise";
import * as config from "../../../config.json";
/**
 * @fileoverview Class definition for ItemSet.
 * @author Andreask Kruhlmann
 * @since 1.2.0
 */

import { handle_exception } from "../../io.js";
import { SetBonus } from "../../typings/types.js";
import { Effect } from "./effect";
import { Item } from "./item";

export class ItemSet {

    /**
     * Generates an item set based on a database website url.
     *
     * @async
     * @param id - Database itemset id.
     * @returns - Generated item set.
     */
    public static async from_id(itemset_id: string): Promise<void | ItemSet> {
        return ItemSet.from_url(`${config.host}/?itemset=${itemset_id}`);
    }

    /**
     * Generates an item set based on a database website url.
     *
     * @async
     * @param url - URL of itemset.
     * @returns - Generated item set.
     */
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

            main_content.find("ul").first().find("li").each(async (li) => {
                const id = $(li)
                    .find("a").first()
                    .attr("href")
                    .replace("?spell=", "");
                const pieces_required = $(li).text().charAt(0);
                const effect = await Effect.from_id(id, "Equip");
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
     * @param name - Name of item set.
     * @param items - Items included in this set.
     * @param set_bonuses - Set bonuses, which apply for this item set.
     */
    public constructor(name: string, items: Item[], set_bonuses: SetBonus[]) {
        this.name = name;
        this.items = items;
        this.set_bonuses = set_bonuses;
    }

}
