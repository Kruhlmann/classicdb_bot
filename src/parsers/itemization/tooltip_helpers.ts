/**
 * @fileoverview Functions for parsing complex properties for ItemizationItems.
 * @author Andreas Kruhlmann
 * @since 1.3.9
 */

import { ItemizationItem, ItemizationItemMeta } from "../../typings/types";

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
const wowwiki_url = "https://wowwiki.fandom.com/wiki/Patch_";


export default class ItemizationItemTooltipHelpers {
    /**
     * Determines and parses the slot for an item.
     *
     * @param i - Item to parse.
     * @returns - Item slot string.
     */
    public static slot(i: ItemizationItem): string {
        if (i.Type === "Weapon") {
            let prefix = "";
            const suffix = i.Subtype === "Fist" ? "Fist weapon" : i.Subtype;
            switch (i.Slot) {
                case "One-hand": prefix = "One-handed"; break;
                case "Two-hand": prefix = "Two-handed"; break;
                case "Ranged": prefix = ""; break;
                default: prefix = i.Slot;
            }
            return `**${prefix} ${suffix}**`;
        } else {
            if (i.Slot === "Shield" || i.Slot === "Back") {
                return i.Slot;
            } else {
                return `${i.Subtype} ${i.Slot}`;
            }
        }
    }

    /**
     * Returns the damage range of a weapon item.
     *
     * @param i - Item to parse.
     * @returns - Weapon damage range per swing.
     */
    public static damage(i: ItemizationItem): string {
        let result = "";
        for (const damage_type of Object.keys(i.Damage)) {
            const min = i.Damage[damage_type].Min;
            const max = i.Damage[damage_type].Max;
            result += damage_type === "Physical"
                ? `**${min} - ${max} Damage**\n`
                : `**+${min} - ${max} ${damage_type} Damage**\n`;
        }
        return result;
    }

    /**
     * Returns the damage per second of a weapon item.
     *
     * @param i - Item to parse.
     * @returns - Weapon damage per second.
     */
    public static dps(i: ItemizationItem): string {
        return i.DPS ? `**(${i.DPS.toFixed(1)} damage per second)**\n` : "";
    }

    /**
     * Finds stats and/or resistances on an item and parses them.
     *
     * @param i - Item to parse.
     * @returns - Stats and resiatance values where applicable.
     */
    public static stats(i: ItemizationItem): string {
        let result = "";
        if (i.Stats) {
            for (const stat of Object.keys(i.Stats)) {
                result += `+${i.Stats[stat]} ${stat}\n`;
            }
        }
        if (i.Resists) {
            for (const resistance of Object.keys(i.Resists)) {
                result += `+${i.Resists[resistance]} ${resistance} Resistance\n`;
            }
        }
        return result;
    }

    /**
     * Finds all effects of an item and represents (and returns) them as a
     * string.
     *
     * @param i - Item to parse.
     * @returns - Effect descriptions.
     */
    public static effects(i: ItemizationItem) {
        let result = "";
        for (const effect of i.Effects) {
            result += `**${effect.Trigger}: ${effect.Effect}**\n`;
        }
        return result;
    }

    /**
     * Finds the proper source of the item (quest, crafting or drop).
     *
     * @param i - Item to parse.
     * @returns - Item source description.
     */
    public static source(i: ItemizationItem) {
        const uri_zone = `"${encodeURIComponent(i.Source.Zone)}"`;
        const uri_entity = `"${encodeURIComponent(i.Source.Entity)}"`;

        const zurl = `${search_url_stub}source:${uri_zone || ""}`;
        const eurl = `${search_url_stub}source:${uri_entity || ""}`;

        const zone = i.Source.Zone ? `in [${i.Source.Zone}](${zurl})` : "";
        const entity = i.Source.Entity ? `[${i.Source.Entity}](${eurl})` : "";

        if (i.Source.Type === "Quest" && i.Source.Entity) {
            // Entity in this case represents the name of a quest.
            return `Source: Awarded from _${i.Source.Entity}_ ${zone}\n`;
        }

        if (i.Source.Type === "Container" && i.Source.Entity) {
            return `Source: Contained in _${i.Source.Entity}_ ${zone}\n`;
        }

        if (i.Source.Type === "Drop" && i.Source.Entity) {
            return `Source: Dropped by ${entity} ${zone}\n`;
        }

        if (i.Source.Type === "Crafting" && i.Source.Entity) {
            const profession = proffesions[i.Source.Entity]
                || i.Source.Entity;
            return `Source: Crafted by [${profession}](${eurl}) ${zone}\n`;
        }

        return "";
    }

    /**
     * Constructs a patch tooltip for an item and its root item metadata object.
     *
     * @param i - Item to parse.
     * @param im - Item metadata.
     * @returns - Item source description.
     */
    public static patch(i: ItemizationItem, im: ItemizationItemMeta) {
        const iinfo_url = `${search_url_stub}patch:${i.Patch}`;
        const patch_url = `https://wowwiki.fandom.com/wiki/Patch_${i.Patch}`;

        // Find the first instance of the item.
        const first_avaliable_version = im.Previous.sort((a, b) => {
            const parsed_patch_a = parseFloat(a.Patch.replace("1.", ""));
            const parsed_patch_b = parseFloat(b.Patch.replace("1.", ""));
            return parsed_patch_a - parsed_patch_b;
        })[0];
        const first_patch = first_avaliable_version.Patch;

        // If this instance of the item has the same patch as the first instance
        // then it must be the same instance, and as such a new item.
        const is_new_item = first_patch === i.Patch;

        if (is_new_item || im.Previous[0].Patch === "999999999999") {
            // Item is brand new.
            return `Added in patch ${i.Patch}. [View items](${iinfo_url})`
                + ` • [View patch notes](${patch_url})\n`;
        } else {
            // Item has undergone changes.
            const first_patch_wiki = wowwiki_url + first_patch;
            const first_patch_db = `${search_url_stub}patch:${first_patch}`;
            return `Added in patch ${first_patch}. [View items]`
                + `(${first_patch_db}) • [View patch notes]`
                + `(${first_patch_wiki})\nChanged in patch ${i.Patch}. `
                + `[View items](${iinfo_url}) • [View patch notes]`
                + `(${patch_url})`;
        }
    }
}
