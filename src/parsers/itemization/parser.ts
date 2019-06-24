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

export const item_quality_colors: {[index: string]: number} = {
    ["Artifact"]: 0xe5cc80, // Artifact
    ["Legendary"]: 0xff8000, // Legendary
    ["Epic"]: 0xa335ee, // Epic.
    ["Rare"]: 0x0070dd, // Rare.
    ["Uncommon"]: 0x1EFF00, // Uncommon.
    ["Poor"]: 0x9d9d9d, // Poor.
};

function make_damage_tooltip(item: ItemizationItem): string {
    let result = "";
    for (const damage_type of Object.keys(item.Damage)) {
        const min = item.Damage[damage_type].Min;
        const max = item.Damage[damage_type].Max;
        result += damage_type === "Physical"
            ? `**${min} - ${max} Damage**\n`
            : `**+${min} - ${max} ${damage_type} Damage**\n`;
    }
    return result;
}

function make_dps_tooltip(item: ItemizationItem): string {
    return item.DPS ? `**(${item.DPS.toFixed(1)} damage per second)**\n` : "";
}

function make_stats_tooltip(item: ItemizationItem): string {
    let result = "";
    for (const stat of Object.keys(item.Stats)) {
        result += `+${item.Stats[stat]} ${stat}\n`;
    }
    return result;
}

function make_resists_tooltip(item: ItemizationItem): string {
    let result = "";
    for (const resistance of Object.keys(item.Resists)) {
        result += `+${item.Resists[resistance]} ${resistance} Resistance\n`;
    }
    return result;
}

function make_slot_tooltip(item: ItemizationItem): string {
    if (item.Type === "Weapon") {
        let prefix = "";
        const suffix = item.Subtype === "Fist" ? "Fist weapon" : item.Subtype;
        switch (item.Slot) {
            case "One-hand": prefix = "One-handed"; break;
            case "Two-hand": prefix = "Two-handed"; break;
            case "Ranged": prefix = ""; break;
            default: prefix = item.Slot; break;
        }
        return `**${prefix} ${suffix}**`;
    } else {
        return item.Slot === "Shield" || item.Slot === "Back"
            ? item.Slot
            : `${item.Subtype} ${item.Slot}`;
    }
}

function make_effects_tooltip(item: ItemizationItem): string {
    let result = "";
    for (const effect of item.Effects) {
        result += `**${effect.Trigger}: ${effect.Effect}**\n`;
    }
    return result;
}

function make_source_tooltip(item: ItemizationItem): string {
    if (item.Source.Type === "Quest" && item.Source.Entity) {
        const zone = item.Source.Zone ? `in "${item.Source.Zone}"` : "";
        return `Source: Awarded from _${item.Source.Entity}_ ${zone}\n`;
    }
    if (item.Source.Type === "Drop" && item.Source.Entity) {
        const zone = item.Source.Zone ? `in "${item.Source.Zone}"` : "";
        return `Source: Dropped by _${item.Source.Entity}_ ${zone}\n`;
    }
    return "";
}

function make_patch_tooltip(item: ItemizationItem,
                            item_meta: ItemizationItemMeta): string {
    const patch_url = `https://wowwiki.fandom.com/wiki/Patch_${item.Patch}`;
    const iinfo_url = `https://itemization.info/?search=patch:${item.Patch}`;
    const is_new_item = item_meta.Previous.sort((a, b) => {
        return parseFloat(a.Patch) - parseFloat(b.Patch);
    })[0].Patch === item.Patch;
    const prefix = !!item_meta.Previous && is_new_item ? "Added" : "Changed";
    return `${prefix} in patch ${item.Patch}. [View items](${iinfo_url})`
           + ` • [View patch notes](${patch_url})\n`;
}


function item_to_message_desc(im: ItemizationItemMeta, patch?: string): string {
    const item_liststing = [im.Current, ...im.Previous];
    const item = item_liststing.find((i) => i.Patch === patch) || im.Current;

    return `${item.Bonding ? `${item.Bonding}\n` : ""}`
            + `${item.Unique ? "Unique\n" :  ""}`
            + `${make_slot_tooltip(item)}\n`
            + `${item.Armor ? `**${item.Armor} Armor**\n` : ""}`
            + `${item.Speed ? `**Speed ${item.Speed.toFixed(2)}**\n` : ""}`
            + `${item.DPS ? make_damage_tooltip(item) : ""}`
            + `${item.DPS ? make_dps_tooltip(item) : ""}`
            + `${item.Stats ? make_stats_tooltip(item) : ""}`
            + `${item.Resists ? make_resists_tooltip(item) : ""}`
            + `${item.Durability
                ? `Durability ${item.Durability}/${item.Durability}\n`
                : ""}`
            + `${item.RequiredLevel
                ? `Requires Level ${item.RequiredLevel}\n`
                : ""}`
            + `${item.Effects ? make_effects_tooltip(item) : ""}`
            + `${item.Source ? make_source_tooltip(item) : ""}`
            + `${item.Patch ? make_patch_tooltip(item, im) : ""}`;
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

export class ItemizationParser implements Parser {
    public async respond_to(message: string) {
        const query = get_item_request(message);
        if (!query.item || query.item === "") {
            return;
        }
        const items = await request({
            body: {
                apiKey: config.itemization_token,
                query: query.item,
            },
            json: true,
            method: "POST",
            uri: "https://itemization.info/api/search",
        });

        const item: ItemizationItemMeta = items[0] || null;
        if (!item) {
            return [new RichEmbed()
                .setDescription(`Unable to find item "${query.item}"`)];
        }

        if (!item.Previous) {
            item.Previous = [{
                Unique: false,
                ItemLevel: 0,
                Patch: "999999999999",
                Name: "Unknown",
                Quality: "",
                Slot: "",
                Type: "",
                Subtype: "",
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
}
