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
import { build_messages_i } from "../classicdb/parser.js";

const search_url_stub = "https://itemization.info/?search=";
const proffesions: {[s: string]: string} = {
    Alchemy: "Alchemists",
    Blacksmithing: "Blacksmiths",
    Cooking: "Cooks",
    Enchanting: "Enchanters",
    Engineering: "Engineers",
    Fishing: "Fishermen",
    Herbalism: "Herbalists",
    Leatherworking: "Leatherworkers",
    Mining: "Mining",
    Tailoring: "Tailors",
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
        if (item.Slot === "Shield" || item.Slot === "Back") {
            return item.Slot;
        } else {
            return `${item.Subtype} ${item.Slot}`;
        }
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
    const uri_zone = `"${encodeURIComponent(item.Source.Zone)}"`;
    const uri_entity = `"${encodeURIComponent(item.Source.Entity)}"`;

    const zurl = `${search_url_stub}source:${uri_zone || ""}`;
    const eurl = `${search_url_stub}source:${uri_entity || ""}`;

    const zone = item.Source.Zone ? `in [${item.Source.Zone}](${zurl})` : "";
    const entity = item.Source.Entity ? `[${item.Source.Entity}](${eurl})` : "";

    if (item.Source.Type === "Quest" && item.Source.Entity) {
        // Entity in this case represents the name of a quest.
        return `Source: Awarded from _${item.Source.Entity}_ ${zone}\n`;
    }

    if (item.Source.Type === "Drop" && item.Source.Entity) {
        return `Source: Dropped by ${entity} ${zone}\n`;
    }

    if (item.Source.Type === "Crafting" && item.Source.Entity) {
        const profession = proffesions[item.Source.Entity]
            || item.Source.Entity;
        return `Source: Crafted by [${profession}](${eurl}) ${zone}\n`;
    }

    return "";
}

function make_patch_tooltip(item: ItemizationItem,
                            item_meta: ItemizationItemMeta): string {
    const patch_url = `https://wowwiki.fandom.com/wiki/Patch_${item.Patch}`;
    const iinfo_url = `${search_url_stub}patch:${item.Patch}`;
    const is_new_item = item_meta.Previous.sort((a, b) => {
        const parsed_patch_a = parseFloat(a.Patch.replace("1.", ""));
        const parsed_patch_b = parseFloat(b.Patch.replace("1.", ""));
        return parsed_patch_a - parsed_patch_b;
    })[0].Patch === item.Patch;

    const prefix = is_new_item || item_meta.Previous[0].Patch === "999999999999"
        ? "Added"
        : "Changed";
    return `${prefix} in patch ${item.Patch}. [View items](${iinfo_url})`
           + ` • [View patch notes](${patch_url})\n`;
}


function item_to_message_desc(im: ItemizationItemMeta, patch?: string): string {
    const item_liststing = [im.Current, ...im.Previous];
    const found_patched_item = item_liststing.find((i) => i.Patch === patch);
    const item = found_patched_item || im.Current;

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

function fetch_items(query: ItemizationQuery) {
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

export class ItemizationParser implements Parser {

    public async respond_to(message: string) {
        const query = get_item_request(message);
        if (!query.item || query.item === "") {
            return;
        }
        const items = await fetch_items(query);
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

        return build_discord_message(query, item);
    }
}
