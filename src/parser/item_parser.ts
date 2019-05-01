/**
 * @fileoverview Handles item message parsing
 * @author Andreas Kruhlmann
 * @since 1.2.0
 */

import { weapon_types, weapon_slots_suffixes, armor_types } from "../consts";
import { handle_exception } from "../io";
import * as request from "request-promise";
import { create_spell_messages,
         create_stats_message } from "../message_factory";
import * as config from "../../config.json";
import { fetch_thumbnail } from "../lib";
import { RichEmbed } from "discord.js";
import { parse_tooltip } from "./parser";
import { Item } from "../typings/types";


/**
 * Parses the stats table of an item node.
 *
 * @param {CheerioElement} stats_table - Main table.
 * @param {CheerioStatic} $ - Cheerio object.
 * @returns {string[]} - Parsed stats.
 */
export function parse_stats_table(stats_table: CheerioElement,
                                  $: CheerioStatic): string[] {
    // Return array.
    let stats: string[] = [];

    // <table> elements get special treatment, so they are parsed first and then
    // subsequently removed from the HTML of the main table.
    $(stats_table)
        .find("tbody > tr > td")
        .children("table")
        .each((_: number, e: CheerioElement) => {
            const inner_tbl = $(e);

            // The first <td> element of the table is the slot of the equipment.
            // The second element is the type of item.
            const e1 = $(inner_tbl.find("tbody").find("tr").find("td")).text();
            const e2 = $(inner_tbl.find("tbody").find("tr").find("th")).text();

            // IF e2 is empty that means there is not equipment type present and
            // te slot should just be used as the stat.
            if (e2 === "") {
                stats.push(`**${e1}**`);
            } else {
                // Some item types (weapons, armor and weapon damage) get
                // special formatting.
                if (weapon_types.includes(e2.toLowerCase())) {
                    stats = [...stats, ...equipment_str(e1, e2)];
                } else if (armor_types.includes(e1.toLowerCase())) {
                    stats = [...stats, `${e2} ${e1}`];
                } else if (e1.includes("Damage")) {
                    const weapon_damage = e1.replace("Damage", "");
                    const attack_interval = e2.replace("Speed", "");
                    const swing_damage = `**${weapon_damage.trim()} damage**`;
                    const swing_interval = `**${attack_interval}** seconds`;
                    stats.push(`${swing_damage} every ${swing_interval}`);
                }
            }

            // Remove the parsed stat table from the main table, so as not to
            // accidentally parse it twice, when other stats are parsed as
            // .text().
            $(stats_table).html($(stats_table).html().replace(inner_tbl.html(), ""));
        });

    // Purge all table stats from the DOM and split the remaining stats into an
    // array.
    const prune_regex = /<table width="100%">.*?<\/table>/g;
    const pruned_html = $(stats_table).html().replace(prune_regex, "<br>");
    const split_html = pruned_html.split("<br>").filter((node) => {
        return node.trim() !== "" && node.charAt(0) !== "<";
    });

    // Make sure the "Unique" stat goes first.
    const splice_index = split_html.includes("Unique")
        ? 2
        : 1;
    stats.splice(splice_index, 0, ...split_html);

    return stats;
}

/**
 * Returns a single-element array with a formatted equipment string based on the
 * equipment type and it's slot.
 *
 * @param {string} slot - Item slot.
 * @param {string} equipment_type - Equipment type.
 * @returns {string[]} - Single-element array containing the formatted string.
 * If the item did not exist in the weapon types an empty array is returned.
 */
export function equipment_str(slot: string, equipment_type: string): string[] {
    if (weapon_types.includes(equipment_type.toLowerCase())) {
        return weapon_slots_suffixes.includes(slot.toLowerCase())
            ? [`**${slot}ed ${equipment_type}**`]
            : [`**${slot ? `${slot} ` : " "}${equipment_type}**`];
    }
    return [];
}

/**
 * Parses an item and returns an array of messages to send.
 *
 * @async
 * @param {string} item_id - Item ID.
 * @param {string} item_name - Item name.
 * @param {number} item_q - Quality index of the item.
 * @returns {Promise<RichEmbed[]>} - List of messages.
 */
export async function parse_item(item_id: string,
                                 item_name: string,
                                 item_q: number): Promise<void | RichEmbed[]> {
    return request({
        uri: `${config.host}/?item=${item_id}`,
    }).then(async (html: string) => {
        const tooltip = await parse_tooltip(html);
        const item_thumbnail = await fetch_thumbnail(item_id);

        if (!tooltip || !item_thumbnail) {
            return [];
        }

        const item: Item = {
            href: `${config.host}/?item=${item_id}`,
            id: item_id,
            name: item_name,
            quality: item_q,
            spells: tooltip.spells,
            stats: tooltip.stats,
            thumbnail: item_thumbnail,
        };
        const stats_message = create_stats_message(item);
        const spell_messages = create_spell_messages(item);

        return [stats_message, ...spell_messages];
    }).catch((error: Error) => handle_exception(error));
}
