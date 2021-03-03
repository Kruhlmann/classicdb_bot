/**
 * @fileoverview Project wide functions.
 * @author Andreas Kruhlmann
 * @since 1.2.0
 */

import {
    DMChannel,
    GroupDMChannel,
    Guild,
    Message,
    TextChannel,
} from "discord.js";
import * as request from "request-promise";

import * as config from "../config.json";

import * as db from "./db.js";
import {
    ChannelIdentity,
    CharacterClass,
    ItemQuality,
} from "./typings/types.js";

const HELP_TEXT =
    "**Avaliable commands:**```css\n" +
    "help:         " +
    "- Displays this text.\n" +
    "toggle_memes:" +
    " - Allows/disallows the use of joke responses." +
    "```";

/**
 * Returns the URL of an icon based on it's name in the JavaScript.
 *
 * @param {string} icon_name - Icon name as seen in the JavaScript of wowhead
 * based websites.
 * @returns {string} - Asbolute icon URL.
 */
export function get_large_icon_url(icon_name: string): string {
    icon_name = icon_name.toLowerCase();
    return `${config.host}/images/icons/large/${icon_name}.jpg`;
}

/**
 * Converts a datbase CSS element class into a ItemQuality.
 *
 * @param class_name - CSS class.
 * @returns - Corresponding ItemQuality.
 */
export function css_class_to_item_quality(class_name: string): ItemQuality {
    switch (class_name) {
        case "q0":
            return ItemQuality.POOR;
        case "q1":
            return ItemQuality.COMMON;
        case "q2":
            return ItemQuality.UNCOMMON;
        case "q3":
            return ItemQuality.RARE;
        case "q4":
            return ItemQuality.EPIC;
        case "q5":
            return ItemQuality.LEGENDARY;
        case "q6":
            return ItemQuality.ARTIFACT;
        case "q7":
            return ItemQuality.BLIZZARD;
        default:
            return ItemQuality.NOQUALITY;
    }
}

/**
 * Converts a datbase CSS element class into a CharacterClass.
 *
 * @param class_name - CSS class.
 * @returns - Corresponding CharacterClass.
 */
export function css_class_to_player_class(class_name: string): CharacterClass {
    switch (class_name) {
        case "c1":
            return CharacterClass.WARRIOR;
        case "c2":
            return CharacterClass.PALADIN;
        case "c3":
            return CharacterClass.HUNTER;
        case "c4":
            return CharacterClass.ROGUE;
        case "c5":
            return CharacterClass.PRIEST;
        case "c7":
            return CharacterClass.SHAMAN;
        case "c8":
            return CharacterClass.MAGE;
        case "c9":
            return CharacterClass.WARLOCK;
        case "c11":
            return CharacterClass.DRUID;
        default:
            return CharacterClass.NOCLASS;
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

/**
 * Finds the string representation of the type of a discord message channel.
 *
 * @param channel - Discord channel object.
 * @param author - Author of message in the channel.
 * @returns - ChannelIdentity object withhannel and guild name as strings.
 */
export function get_channel_identity(
    channel: TextChannel | GroupDMChannel | DMChannel,
    author: string
): ChannelIdentity {
    let channel_name = "";
    let guild_name = "";
    let owner_id = "";
    let guild_id = "";

    if (channel.type === "dm") {
        channel_name = `Private DM for user ${author}`;
        guild_name = `Private DM for user ${author}`;
        guild_id = `Private DM for user ${author}`;
        owner_id = `Private DM for user ${author}`;
    } else if (channel.type === "group") {
        channel_name = "Group DM";
        guild_name = "Group DM";
        guild_id = null;
        owner_id = null;
    } else {
        channel_name = (channel as TextChannel).name;
        guild_name = (channel as TextChannel).guild.name;
        guild_id = (channel as TextChannel).guild.id;
        owner_id = (channel as TextChannel).guild.ownerID;
    }

    return {
        guild_id,
        guild_name,
        name: channel_name,
        owner_id,
    };
}

export async function toggle_memes(guild: Guild) {
    try {
        const enabled = await db.toggle_memes(guild);
        if (enabled) {
            return "Memes have been toggled **ON**.";
        }
        return "Memes have been toggled **OFF**.";
    } catch (e) {
        return "An error occurred while toggling memes.";
    }
}

export async function execute_user_command(
    command_name: string,
    message: Message,
    guild: Guild
): Promise<string> {
    if (command_name == "help") {
        return HELP_TEXT;
    } else if (command_name == "toggle_memes") {
        const is_owner = message.author.id === message.guild.ownerID;
        const is_sudo = config.override_ids.includes(message.author.id);
        if (is_owner || is_sudo) {
            return toggle_memes(guild);
        } else {
            return `Only the head janitor is allowed to do that. Ask for ${message.guild.owner.displayName}`;
        }
    }
    return `*Unrecognized command* \`${command_name}\`\n\n${HELP_TEXT}`;
}

/**
 * Finds the thumbnail of either an item or a spell.
 *
 * @async
 * @param id - Spell/item id.
 * @param spell - If true will look for a spell, else looks
 * for an item.
 */
export async function fetch_thumbnail(
    id: string,
    spell = false
): Promise<string> {
    const url = `${config.host}/?${spell ? "spell" : "item"}=${id}`;
    const html = await request(url);
    // Find the JavaScript line with "Icon.create" in from which the item
    // identifier can be extracted.
    const split_dom =
        html
            .split("\n")
            .filter((html_stub: string) => html_stub.includes("Icon.create")) ||
        [];
    if (split_dom.length < 1) {
        return "";
    }
    const split_js = split_dom[0].trim().split("Icon.create");
    const icon = split_js[split_js.length - 1].split("'")[1];
    return get_large_icon_url(icon);
}

/**
 * Tests whether a string is a representation of a numerical integet.
 *
 * @param str - String to test.
 * @returns - True if string represents a numerical integer.
 */
export function is_string_numerical_int(str: string): boolean {
    const type_string = typeof str === "string";
    const regex_match = /^[-+]?[1-9]{1}\d+$|^[-+]?0$/.test(str);
    return type_string && regex_match;
}
