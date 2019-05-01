/**
 * @fileoverview Builds discord RichEmbed messages.
 * @author Andreas Kruhlmann
 * @since 1.2.0
 */

import * as discord from "discord.js";
import { favicon_path, github_href,
         github_icon,
         item_quality_colors } from "./consts";
import { Item } from "./typings/types";

export function create_spell_messages(item: Item): discord.RichEmbed[] {
    const messages = [];
    for (const spell of item.spells) {
        messages.push(new discord.RichEmbed()
            .setColor(item_quality_colors[item.quality])
            .setTitle(spell.name)
            .setDescription(`*${spell.desc}*`)
            .setThumbnail(spell.thumbnail)
            .setURL(spell.href));
    }
    return messages;
}

export function create_stats_message(item: Item): discord.RichEmbed {
    return new discord.RichEmbed()
        .setColor(item_quality_colors[item.quality])
        .setTitle(item.name)
        .setDescription(item.stats.join("\n"))
        .setAuthor("Classic DB", favicon_path, item.href)
        .setThumbnail(item.thumbnail)
        .setFooter(github_href, github_icon)
        .setURL(item.href);
}
