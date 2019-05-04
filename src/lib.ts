/**
 * @fileoverview Project wide functions.
 * @author Andreas Kruhlmann
 * @since 1.2.0
 */

import { DMChannel, GroupDMChannel, TextChannel } from "discord.js";
import * as request from "request-promise";
import * as config from "../config.json";
import { ChannelIdentity, CharacterClass, ItemQuality } from "./typings/types.js";

/**
 * Returns the URL of an icon based on it's name in the JavaScript.
 *
 * @param {string} icon_name - Icon name as seen in the JavaScript of wowhead
 * based websites.
 * @returns {string} - Asbolute icon URL.
 */
export function get_large_icon_url(icon_name: string) {
    icon_name  = icon_name.toLowerCase();
    return `${config.host}/images/icons/large/${icon_name}.jpg`;
}

export function css_class_to_item_quality(class_name: string): ItemQuality {
    switch (class_name) {
        case "q1": return ItemQuality.POOR;
        case "q2": return ItemQuality.COMMON;
        case "q3": return ItemQuality.UNCOMMON;
        case "q4": return ItemQuality.RARE;
        case "q5": return ItemQuality.EPIC;
        case "q6": return ItemQuality.LEGENDARY;
        case "q7": return ItemQuality.ARTIFACT;
        case "q8": return ItemQuality.BLIZZARD;
        default: return ItemQuality.NOQUALITY;
    }
}

export function css_class_to_player_class(class_name: string): CharacterClass {
    switch (class_name) {
        case "c1": return CharacterClass.WARRIOR;
        case "c2": return CharacterClass.PALADIN;
        case "c3": return CharacterClass.HUNTER;
        case "c4": return CharacterClass.ROGUE;
        case "c5": return CharacterClass.PRIEST;
        case "c7": return CharacterClass.SHAMAN;
        case "c8": return CharacterClass.MAGE;
        case "c9": return CharacterClass.WARLOCK;
        case "c11": return CharacterClass.DRUID;
        default: return CharacterClass.NOCLASS;
    }
}

/**
 * Finds the first item in the list with item type 3 (Item)
 *
 * @param item_details - List of item details; id,
 * quality, item type and thumbnail.
 * @returns - Index of the item if found, else -1.
 */
export function find_first_item_index(item_details: number[][]): number {
    for (let i = 0; i < item_details.length; i++) {
        if (item_details[i][0] === 3) {
            return i;
        }
    }
    return -1;
}

export function get_channel_identity(channel: TextChannel
                                            | GroupDMChannel
                                            | DMChannel,
                                     author: string,
                                     ): ChannelIdentity {
    const channel_name = channel.type === "dm"
        ? `Private DM for user ${author}`
        : channel.type === "group"
            ? "Group DM"
            : (channel as TextChannel).name;
    const guild_name = channel.type === "dm"
        ? `Private DM for user ${author}`
        : channel.type === "group"
            ? "Group DM"
            : (channel as TextChannel).guild.name;
    return {
        channel_name,
        guild_name,
    };
}

/**
 * Finds the thumbnail of either an item or a spell.
 *
 * @async
 * @param {string} id - Spell/item id.
 * @param {boolean} [spell=false] - If true will look for a spell, else looks
 * for an item.
 */
export async function fetch_thumbnail(id: string, spell = false): Promise <string> {
    const url = `${config.host}/?${spell ? "spell" : "item"}=${id}`;
    console.log(url)
    const html = await request(url);
    // Find the JavaScript line with "Icon.create" in from which the item
    // identifier can be extracted.
    const split_dom = html.split("\n").filter((html_stub: string) => {
        return html_stub.includes("Icon.create");
    }) || [];
    if (split_dom.length < 1) {
        return "";
    }
    const split_js =  split_dom[0].trim().split("Icon.create");
    const icon = split_js[split_js.length - 1].split("'")[1];
    return get_large_icon_url(icon);
}

/**
 * Test whether a string is a representation of a numerical integet.
 *
 * @param {string} str - String to test.
 * @returns {boolean} - True if string represents a numerical integer.
 */
export function is_string_numerical_int(str: string): boolean {
    const type_string = typeof str === "string";
    const regex_match = /^[-+]?[1-9]{1}\d+$|^[-+]?0$/.test(str);
    return type_string && regex_match;
}
