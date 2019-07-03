/**
 * @fileoverview Functions for parsing items.
 * @author Andreas Kruhlmann
 * @since 1.2.0
 */

import { RichEmbed } from "discord.js";
import * as request from "request-promise";
import * as config from "../../../config.json";
import { discord_href,
         discord_icon,
         favicon_path,
         quality_colors_itemization } from "../../consts.js";
import { ItemizationItem,
         ItemizationItemMeta,
         ItemizationQuery,
         Parser} from "../../typings/types.js";
import message_helper from "./message_helpers";

const search_url_stub = "https://itemization.info/?search=";
const proffesions: {[s: string]: string} = {
    Alchemy: "Alchemists",
    Blacksmithing: "Blacksmiths",
    Cooking: "Cooks",
    Enchanting: "Enchanters",
    Engineering: "Engineers",
    Fishing: "Fishermen",
    Herbalism: "Herbalists",
    Leatherworking: "Leatherworkers",
    Mining: "Mining",
    Tailoring: "Tailors",
};

function item_to_message_desc(im: ItemizationItemMeta, patch?: string): string {
    const item_liststing = [im.Current, ...im.Previous];
    const found_patched_item = item_liststing.find((i) => i.Patch === patch);
    const item = found_patched_item || im.Current;

    return message_helper.bonding(item)
        + message_helper.slot(item)
        + message_helper.unique(item)
        + message_helper.armor(item)
        + message_helper.speed(item)
        + message_helper.damage(item)
        + message_helper.dps(item)
        + message_helper.stats(item)
        + message_helper.durability(item)
        + message_helper.required_level(item)
        + message_helper.effects(item)
        + message_helper.source(item)
        + message_helper.patch(item, im);
}

/**
 * Finds potential search matches for \[item_name\].
 *
 * @param message_content - Content of the message to parse.
 * @returns - First match if any were found else undefined.
 */
export function get_item_request(message_content: string): ItemizationQuery {
    const patch_matches = message_content.match(/\[(.*?)\]\[(.*?)\]/);
    if (patch_matches && patch_matches.length > 2) {
        return {item: patch_matches[1], patch: patch_matches[2]};
    }

    const matches = message_content.match(/\[(.*?)\]/);
    if (matches && matches.length > 1) {
        return {item: matches[1], patch: null};
    }

    return {item: null, patch: null};
}

function fetch_items(query: ItemizationQuery) {
    return request({
        body: {
            apiKey: config.itemization_token,
            query: query.item,
        },
        json: true,
        method: "POST",
        uri: "https://itemization.info/api/search",
    });
}

function build_discord_message(query: ItemizationQuery,
                               item: ItemizationItemMeta,
                               ): RichEmbed[] {
    const computed_color = quality_colors_itemization[item.Current.Quality];
    return [new RichEmbed()
        .setColor(computed_color || "#fff")
        .setTitle(`${item.Current.Name} ${query.patch
            ? `(patch ${query.patch})`
            : "(latest patch)"}`)
        .setDescription(item_to_message_desc(item, query.patch))
        .setAuthor("Classic DB Bot (itemization.info)",
                   favicon_path,
                   discord_href)
        .setThumbnail(`https://itemization.info/icons/${item.Icon}.png`)
        .setFooter("https://discord.gg/mRUEPnp", discord_icon)
        .setURL(`https://itemization.info/item/${item.ID}`)];
}

export class ItemizationParser implements Parser {

    public async respond_to(message: string) {
        const query = get_item_request(message);
        if (!query.item || query.item === "") {
            return;
        }
        const items = await fetch_items(query);
        const item: ItemizationItemMeta = items[0] || null;

        if (!item) {
            const err_message = `Unable to find item "${query.item}"`;
            return [new RichEmbed().setDescription(err_message)];
        }

        if (!item.Previous) {
            item.Previous = [{
                ItemLevel: 0,
                Name: "Unknown",
                Patch: "999999999999",
                Quality: "",
                Slot: "",
                Subtype: "",
                Type: "",
                Unique: false,
            }];
        }

        const item_had_patch_data = !item.Previous.find((i) => {
            return i.Patch === query.patch;
        }) && item.Current.Patch !== query.patch;

        if (query.patch && item_had_patch_data) {
            let suffix = `**[${item.Current.Name}]**\n`;
            [item.Current, ...item.Previous].forEach((i) => {
                suffix += `**[${i.Name}][${i.Patch}]**\n`;
            });
            return [new RichEmbed().setDescription("Unable to find item changes"
                + ` for **\`${item.Current.Name}\`** in patch `
                + `**\`${query.patch}\`**. The item has data for the following `
                + `patch entries:\n\n${suffix}`)];
        }

        return build_discord_message(query, item);
    }
}
