/**
 * @fileoverview Functions for parsing properties for ItemizationItems.
 * @author Andreas Kruhlmann
 * @since 1.3.9
 */

import { ItemizationItem, ItemizationItemMeta } from "../../typings/types";

import tooltip_helper from "./tooltip_helpers";

export default class ItemizationItemHelper {
    /**
     * Returns the bonding status of an item. Either No binding (""), binds when
     * picked up "Binds when picked up" or binds when equipped "Binds when
     * equipped".
     *
     * @param i - Item to parse.
     * @returns - Item bonding.
     */
    public static bonding(i: ItemizationItem): string {
        return `${i.Bonding ? `${i.Bonding}\n` : ""}`;
    }

    /**
     * Returns the unique status of an item. Either "Unique" or "".
     *
     * @param i - Item to parse.
     * @returns - Item unique status.
     */
    public static slot(i: ItemizationItem): string {
        return `${tooltip_helper.slot(i)}\n`;
    }

    /**
     * Returns the unique status of an item. Either "Unique" or "".
     *
     * @param i - Item to parse.
     * @returns - Item unique status.
     */
    public static unique(i: ItemizationItem): string {
        return `${i.Unique ? "Unique\n" :  ""}`;
    }

    /**
     * Returns the armor value of an item.
     *
     * @param i - Item to parse.
     * @returns - Armor value.
     */
    public static armor(i: ItemizationItem): string {
        return `${i.Armor ? `**${i.Armor} Armor**\n` : ""}`;
    }

    /**
     * Returns the block value of an item.
     *
     * @param i - Item to parse.
     * @returns - Block value.
     */
    public static block(i: ItemizationItem): string {
        if (i.Block) {
            if (i.Block !== i.BlockValue) {
                return `**${i.Block} (+${i.BlockValue - i.Block}) Block**\n`;
            }
            return `**${i.Block} Block**\n`;
        }
        return "";
    }

    /**
     * Returns the speed of a weapon item.
     *
     * @param i - Item to parse.
     * @returns - Weapon swing timer.
     */
    public static speed(i: ItemizationItem): string {
        return `${i.Speed ? `**Speed ${i.Speed.toFixed(2)}**\n` : ""}`;
    }

    /**
     * Returns the damage range of a weapon item.
     *
     * @param i - Item to parse.
     * @returns - Weapon damage range per swing.
     */
    public static damage(i: ItemizationItem): string {
        return `${i.DPS ? tooltip_helper.damage(i) : ""}`;
    }

    /**
     * Returns the damage per second of a weapon item.
     *
     * @param i - Item to parse.
     * @returns - Weapon damage per second.
     */
    public static dps(i: ItemizationItem): string {
        return `${i.DPS ? tooltip_helper.dps(i) : ""}`;
    }

    /**
     * Returns the damage per second of a weapon item.
     *
     * @param i - Item to parse.
     * @returns - Weapon damage per second.
     */
    public static stats(i: ItemizationItem) {
        return `${i.Stats || i.Resists ? tooltip_helper.stats(i) : ""}`;
    }

    /**
     * Returns the durability of an item.
     *
     * @param i - Item to parse.
     * @returns - Item durability.
     */
    public static durability(i: ItemizationItem) {
        const dur = i.Durability;
        return `${dur ? `Durability ${dur}/${dur}\n` : ""}`;
    }

    /**
     * Returns the level requirement of an item if applicable.
     *
     * @param i - Item to parse.
     * @returns - Item level requirement.
     */
    public static required_level(i: ItemizationItem) {
        const req_level = i.RequiredLevel;
        return `${req_level ? `Requires Level ${req_level}\n` : ""}`;
    }

    /**
     * Finds all effects of an item and represents (and returns) them as a
     * string.
     *
     * @param i - Item to parse.
     * @returns - Effect descriptions.
     */
    public static effects(i: ItemizationItem) {
        return i.Effects ? tooltip_helper.effects(i) : "";
    }

    /**
     * Finds the proper source of the item (quest, crafting or drop).
     *
     * @param i - Item to parse.
     * @returns - Item source description.
     */
    public static source(i: ItemizationItem) {
        return i.Source ? tooltip_helper.source(i) : "";
    }

    /**
     * Constructs a patch tooltip for an item and its root item metadata object.
     *
     * @param i - Item to parse.
     * @param im - Item metadata.
     * @returns - Item source description.
     */
    public static patch(i: ItemizationItem, im: ItemizationItemMeta) {
        return i.Patch ? tooltip_helper.patch(i, im) : "";
    }
}
