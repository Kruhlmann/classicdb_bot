// /**
//  * @fileoverview Functions for parsing items.
//  * @author Andreas Kruhlmann
//  * @since 1.2.0
//  */

import * as cheerio from "cheerio";
import { RichEmbed } from "discord.js";
import * as request from "request-promise";
import * as config from "../../config.json";
import { handle_exception } from "../io";
import { find_first_item_index, is_string_numerical_int } from "../lib.js";
import { Item } from "./item.js";

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
        // Item information is always located in element 7 of the result.
        const item_details = result[7];
        const first_item_index = find_first_item_index(item_details);
        if (first_item_index === -1) {
            return [];
        }
        // Item ID is always located in element 1 of an item.
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
 * @returns {Promise<RichEmbed[]>} - List generated messages.
 */
export async function build_messages_i(item_id: string): Promise<RichEmbed[]> {
    const item = await Item.from_id(item_id) as Item;
    const messages = item.build_messages();
    if (!messages) {
        return [];
    } else {
        return messages as RichEmbed[];
    }
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
