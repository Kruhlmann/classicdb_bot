// /**
//  * @fileoverview Functions for parsing items.
//  * @author Andreas Kruhlmann
//  * @since 1.2.0
//  */

import * as cheerio from "cheerio";
import { RichEmbed } from "discord.js";
import * as request from "request-promise";
import * as config from "../../config.json";
import { misc_icon } from "../consts";
import { handle_exception } from "../io";
import { find_first_item_index, is_string_numerical_int } from "../lib.js";
import { ParsedTooltip } from "../typings/types";
import { Item } from "./item.js";
// import { parse_item, parse_stats_table } from "./item_parser";
// import { parse_spells_table } from "./spell_parser";

// /**
//  * Parses the HTML of a tooltip and returns stats and spells found in it.
//  *
//  * @async
//  * @param {string} html - HTML of tooltip.
//  * @returns {Promise<ParsedTooltip>} - Parsed tooltip data.
//  */
// export async function parse_tooltip(html: string): Promise<ParsedTooltip> {
//     return null;
//     // const $ = cheerio.load(html);
//     // const tables = $("div.tooltip > table > tbody > tr > td").children("table");

//     // // First table contains raw stats of the item. Second table contains spells,
//     // // Set bonuses and flavor text.
//     // const stats_table = tables.get(0);
//     // const spells_table = tables.get(1);

//     // const tmp_spells = await parse_spells_table(spells_table, $);
//     // const spells: Spell[] = [];
//     // const stats = parse_stats_table(stats_table, $);
//     // // Push a blank item into the stats list to give space between stats and
//     // // spells.
//     // stats.push("");

//     // // Only add spells, which are actual abilities and not just small effects to
//     // // the list of external spells to be present in the discord message array.
//     // for (const spell of tmp_spells) {
//     //     if (spell.thumbnail !== misc_icon) {
//     //         const link_txt = `**${spell.text.split(":")[0]}**: ${spell.name}`;
//     //         stats.push(`[${link_txt}](${spell.href})`);
//     //         spells.push(spell);
//     //     } else {
//     //         stats.push(`[${spell.text}](${spell.href})`);
//     //     }
//     // }

//     // return {
//     //     spells,
//     //     stats,
//     // };
// }

/**
 * Builds a list of messages based on a search term.
 *
 * @param {string} q - Search term.
 * @returns {Promise<void | RichEmbed[]>} - List generated messages.
 */
export async function build_messages_q(q: string): Promise<void | RichEmbed[]> {
    return request({
        json: true,
        uri: `${config.host}/opensearch.php?search=${q}`,
    }).then(async (result) => {
        if (result === []) {
            return [];
        }
        const item_details = result[7];
        const first_item_index = find_first_item_index(item_details);
        if (first_item_index === -1) {
            return [];
        }
        const item_id = item_details[first_item_index][1];
        const item = await Item.from_id(item_id) as Item;
        const messages = item.build_messages();
        if (!messages) {
            return [];
        } else {
            return messages as RichEmbed[];
        }
    }).catch((error: Error) => handle_exception(error));
}

/**
 * Builds a list of messages based on an item id.
 *
 * @param {string} i - Item id.
 * @returns {Promise<void | RichEmbed[]>} - List generated messages.
 */
export async function build_messages_i(i: string): Promise<void | RichEmbed[]> {
    return new Promise((r) => {
        const tmp_msg = new RichEmbed()
            .setTitle("Sorry, looking for items by id is still in the works.")
            .setDescription(`You searched for item #${i}`);
        r([tmp_msg]);
    });
}

/**
 * Finds potential search matches for [item_name].
 *
 * @param {string} message_content - Content of the message to parse.
 * @returns {string|undefined} - First match if any were found else undefined.
 */
export function get_item_request(message_content: string) {
    const matches = message_content.match(/\[(.*?)\]/);
    if (!matches || matches.length < 2) { return; }
    return matches[1];
}

/**
 * Builds a rich message response if the user requested an item.
 *
 * @param {string} message_content - Content of the message recieved.
 * @returns {Promise<discord.RichEmbed|undefined>} - Rich message object if no
 * error occurred else undefined.
 */
export async function get_message_responses(message_content: string) {
    const match = get_item_request(message_content);
    if (!match) { return; }
    // If the match is an id build the message with that in mind.
    return is_string_numerical_int(match)
        ? build_messages_i(match)
        : build_messages_q(match);
}
