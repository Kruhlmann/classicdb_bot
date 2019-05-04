/**
 * @fileoverview Functions for parsing items.
 * @author Andreas Kruhlmann
 * @since 1.2.0
 */

import { RichEmbed } from "discord.js";
import * as request from "request-promise";
import * as config from "../../config.json";
import { weapon_slots_suffixes, weapon_types } from "../consts.js";
import { find_first_item_index, is_string_numerical_int } from "../lib.js";
import { Item } from "./item.js";

/**
 * Builds a list of messages based on a search term.
 *
 * @param q - Search term.
 * @returns- List generated messages.
 */
export async function build_messages_q(q: string): Promise<RichEmbed[]> {
    const url = `${config.host}/opensearch.php?search=${q}`;
    const result = await request({json: true, uri: url});
    if (result === []) {
        return [];
    }
    // Item information is always located in element 7 of the result.
    const item_details = result[7];
    if (!item_details) {
        return;
    }

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
        return await messages;
    }
}

/**
 * Returns a single-element array with a formatted equipment string based on the
 * equipment type and it's slot.
 *
 * @param slot - Item slot.
 * @param equipment_type - Equipment type.
 * @returns - String containing the formatted string. If the item
 * did not exist in the weapon types an empty array is returned.
 */
export function equipment_str(slot: string, equipment_type: string): string {
    if (weapon_types.includes(equipment_type.toLowerCase())) {
        return weapon_slots_suffixes.includes(slot.toLowerCase())
            ? `**${slot}ed ${equipment_type}**`
            : `**${slot || ""} ${equipment_type}**`;
    }
    return `**${equipment_type} ${slot || ""}**`;
}


/**
 * Builds a list of messages based on an item id.
 *
 * @param item_id - Item id.
 * @returns  - List generated messages.
 */
export async function build_messages_i(item_id: string): Promise<RichEmbed[]> {
    const item = await Item.from_id(item_id) as Item;
    const messages = item.build_messages();
    if (!messages) {
        return [];
    } else {
        return await messages;
    }
}

/**
 * Finds potential search matches for [item_name].
 *
 * @param message_content - Content of the message to parse.
 * @returns - First match if any were found else undefined.
 */
export function get_item_request(message_content: string) {
    const matches = message_content.match(/\[(.*?)\]/);
    if (!matches || matches.length < 2) {
        return;
    }
    return matches[1];
}

/**
 * Builds a rich message response if the user requested an item.
 *
 * @param msg - Content of the message recieved.
 * @returns - List of generated messages.
 */
export async function get_message_responses(msg: string): Promise<RichEmbed[]> {
    const match = get_item_request(msg);
    if (!match) { return; }
    // If the match is an id build the message with that in mind.
    return is_string_numerical_int(match)
        ? await build_messages_i(match)
        : await build_messages_q(match);
}
