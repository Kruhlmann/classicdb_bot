/**
 * @fileoverview Builds discord RichEmbed messages.
 * @author Andreas Kruhlmann
 * @since 1.2.0
 */

import { RichEmbed } from "discord.js";
import { favicon_path, github_href,
         github_icon,
         item_quality_colors } from "./consts";
import { Item } from "./typings/types";

/**
 * Builds a discord message for a list of spell.
 *
 * @param {Item} item - Item with spells.
 * @returns {RichEmbed[]} - Generated messages.
 */
export function create_spell_messages(item: Item): RichEmbed[] {
    const messages = [];
    for (const spell of item.spells) {
        messages.push(new RichEmbed()
            .setColor(item_quality_colors[item.quality])
            .setTitle(spell.name)
            .setDescription(`*${spell.desc}*`)
            .setThumbnail(spell.thumbnail)
            .setURL(spell.href));
    }
    return messages;
}

/**
 * Builds a discord message for a list of stats.
 *
 * @param {Item} item - Item with stats.
 * @returns {RichEmbed} - Generated message.
 */
export function create_stats_message(item: Item): RichEmbed {
    return new RichEmbed()
        .setColor(item_quality_colors[item.quality])
        .setTitle(item.name)
        .setDescription(item.stats.join("\n"))
        .setAuthor("Classic DB", favicon_path, item.href)
        .setThumbnail(item.thumbnail)
        .setFooter(github_href, github_icon)
        .setURL(item.href);
}
