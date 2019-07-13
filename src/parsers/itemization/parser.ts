/**
 * @fileoverview Functions for parsing items.
 * @author Andreas Kruhlmann
 * @since 1.2.0
 */

import { Message, RichEmbed } from "discord.js";
import * as request from "request-promise";
import * as config from "../../../config.json";
import { discord_href,
         discord_icon,
         favicon_path,
         quality_colors_itemization } from "../../consts.js";
import * as db from "../../db.js";
import { ItemizationItemMeta,
         ItemizationQuery,
         Parser} from "../../typings/types.js";
import message_helper from "./message_helpers";

/**
 * Compiles information about an item into a description tooltip fit for a
 * RuchEmbed discord message.
 *
 * @param im - Item metadata.
 * @param patch - Patch if different from latest.
 * @returns - Newline seperated string with item properties.
 */
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

/**
 * Queries the itemization.info API for items based on a user query.
 *
 * @param query - User query.
 */
function fetch_items(query: ItemizationQuery): request.RequestPromise {
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

/**
 * Constructs a RichEmbed array based on an item.
 *
 * @param query - User query information.
 * @param item - Item requested.
 * @returns - List of messages to send based on user query.
 */
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

/**
 * itemization.info parser instance.
 */
export class ItemizationParser implements Parser {
    /**
     * Determines the appropriate response to a user message (if any).
     *
     * @param message - Message to respond to.
     * @returns - Messages to send the the given channel.
     */
    public async respond_to(msg: Message): Promise<RichEmbed[] | undefined> {
        const query = get_item_request(msg.content);
        if (!query.item || query.item === "") {
            return undefined;
        }

        // tslint:disable-next-line: await-promise
        const items = await fetch_items(query) as ItemizationItemMeta[];
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

        const item_had_patch_data = !item.Previous.find((i) =>
            i.Patch === query.patch) && item.Current.Patch !== query.patch;

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

        db.register_query(`${item.ID}`,
                          msg.guild.id,
                          msg.guild.name,
                          "itemization");

        return build_discord_message(query, item);
    }
}
