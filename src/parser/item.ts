/**
 * @fileoverview Class definition for Item.
 * @author Andreask Kruhlmann
 * @since 1.2.0
 */

import * as cheerio from "cheerio";
import { RichEmbed } from "discord.js";
import * as request from "request-promise";
import * as config from "../../config.json";
import { discord_href, discord_icon, favicon_path, github_icon, html_tag_regex, misc_icon } from "../consts.js";
import { css_class_to_item_quality,
         css_class_to_player_class,
         fetch_thumbnail } from "../lib";
import { CharacterClass, ItemBinding } from "../typings/types";
import { Effect } from "./effect";
import { equipment_str } from "./parser.js";
import { Quest } from "./quest.js";

export class Item {

    /**
     * Generates an item based on a tooltip table from the database website.
     *
     * @param id - Database item id.
     * @param href - Link to item.
     * @param effects - List of item effects.
     * @param table - Item tooltip table to parse.
     * @returns - Generated item.
     */
    public static async from_table(id: string,
                                   href: string,
                                   effects: Effect[],
                                   table: Cheerio): Promise<Item> {
        const $ = cheerio.load(table.html());
        const thumbnail = await fetch_thumbnail(id);
        const table_contents = table.find("tr td").first();
        const html = table.find("tr td").first().html();
        const html_lines = html.split(html_tag_regex);
        const name_node = table_contents.find("b").first();
        const class_nodes = table_contents.find("font");

        const name = name_node.text();
        const quality = css_class_to_item_quality(name_node.attr("class"));
        const classes: CharacterClass[] = [];
        class_nodes.each((_, class_node) => {
            const node_class_str = $(class_node).attr("class");
            const required_class = css_class_to_player_class(node_class_str);
            classes.push(required_class);
        });
        const flavor_text = table.find(".q").first().text();
        const binds_on = html.includes("Binds when picked up")
            ? ItemBinding.ON_PICKUP
            : html.includes("Binds when equipped")
                ? ItemBinding.ON_EQUIP
                : ItemBinding.NOBIND;
        const unique = (html_lines.find((line) => {
            const regex = /Unique/g;
            return ((line || "").match(regex) || []).length > 0;
        }) || []).length > 0;
        const armor_line = (html_lines.find((line) => {
            const regex = /[0-9]+ Armor/g;
            return ((line || "").match(regex) || []).length > 0;
        }) || "").split(" ");
        const armor = armor_line.length > 1
            ? parseInt(armor_line[0], 10)
            : null;
        const level_line = (html_lines.find((line) => {
            const regex = /Requires Level [0-9]+/g;
            return ((line || "").match(regex) || []).length > 0;
        }) || "").split(" ");
        const level_requirement = level_line.length > 2
            ? parseInt(level_line[2], 10)
            : null;
        const durability_line = (html_lines.find((line) => {
            const regex = /Durability [0-9]+ \/ [0-9]+/g;
            return ((line || "").match(regex) || []).length > 0;
        }) || "").split("/");
        const durability = durability_line.length > 1
            ? parseInt(durability_line[1].trim(), 10)
            : null;
        const primary_stats = html_lines.filter((line) => {
            return line.startsWith("+") || line.startsWith("-");
        });

        const quest_a = table_contents.find("a").filter((_, a) => {
            const t = $(a).text();
            const h = $(a).attr("href");
            return $(a).attr("href").includes("?quest=")
                && $(a).text() === "This Item Begins a Quest";
        });
        const begins_quest = quest_a.length > 0
            ? await Quest.from_id($(quest_a[0]).attr("href").replace("?quest=", ""))
            : null;

        // Tables
        const table_count = table_contents.find("table").length;
        const equipment_slot = table_count > 0
            ? $(table_contents.find("table")[0]).find("td").text()
            : null;
        const equipment_type = table_count > 0
            ? $(table_contents.find("table")[0]).find("th").text()
            : null;
        const does_damage = table_count > 1;
        const damage_range_line = does_damage
            ? $(table_contents.find("table")[1]).find("td").text()
            : null;
        const swing_speed_line = does_damage
            ? $(table_contents.find("table")[1]).find("th").text()
            : null;
        const damage_range = damage_range_line
            ? {
                high: parseInt(damage_range_line.split(" ")[2], 10),
                low: parseInt(damage_range_line.split(" ")[0], 10),
            } : null;
        const swing_speed = does_damage
            ? parseFloat(swing_speed_line.split("Speed ")[1])
            : null;
        const dps_line = html_lines.find((line) => {
            return line.startsWith("(") && line.includes("damage per second)");
        }) || "";
        const dps = dps_line !== ""
            ? parseFloat(dps_line.replace("(", "")
                .replace(" damage per second)", "")
                .trim())
            : null;
        return new Item(id,
                        name,
                        href,
                        thumbnail,
                        quality,
                        unique,
                        binds_on,
                        begins_quest,
                        classes,
                        level_requirement,
                        durability,
                        primary_stats,
                        effects,
                        armor,
                        equipment_slot,
                        equipment_type,
                        damage_range,
                        swing_speed,
                        dps,
                        flavor_text);
    }

    /**
     * Generates an item based on the database website tooltip html.
     *
     * @param id - Database item id.
     * @param href - Item link.
     * @param html - Tooltip HTML.
     * @returns - Generated item.
     */
    public static async from_tooltip(id: string,
                                     href: string,
                                     html: string): Promise<Item> {
        const $ = cheerio.load(html);
        const tables = $("div.tooltip > table tbody tr td").children("table");

        // First table contains raw stats of the item. Second table contains
        // spells, set bonuses and flavor text.
        const stat_table = tables.get(0);
        const misc_table = tables.get(1);
        const effects = Effect.from_item_table($(misc_table));

        return Item.from_table(id, href, await effects, $(stat_table));
    }

    /**
     * Builds an item from a database item id.
     *
     * @param id - Database item id.
     * @returns - Generated item.
     */
    public static async from_id(id: string | number): Promise<Item> {
        const url = `${config.host}/?item=${id}`;
        const html = await request({uri: url});
        return Item.from_tooltip(`${id}`, url, html);
    }

    // Required properties.
    public id: string;
    public name: string;
    public href: string;
    public thumbnail_href: string;
    public quality_color: string;
    public unique: boolean;
    public binds_on: ItemBinding;

    // Optional properties
    public begins_quest?: Quest;
    public class_restrictions?: CharacterClass[];
    public level_requirement?: number;
    public durability?: number;
    public primary_stats?: string[];
    public effects?: Effect[];
    public armor?: number;
    public equipment_slot?: string;
    public equipment_type?: string;
    public damage_range?: {low: number, high: number};
    public swing_speed?: number;
    public dps?: number;
    public flavor_text?: string;

    /**
     *  Constructor.
     *
     * @constructor
     * @param id- Item id in database.
     * @param name - In-game name.
     * @param href - Database link.
     * @param quality_color - Color of quality (purple for epic, blue for rare);
     * @param thumbnail_href - Thumbnail link.
     * @param unique - Whether the item is unique.
     * @param binds_on - Type of binding (pickup, equip, no binding).
     * @param begins_quest - Quest this item begins if applicable.
     * @param class_restrictions - List of classes, which can equip the item.
     * @param level_requirement - Required level to equip item.
     * @param durability - Maximum durability.
     * @param primary_stats - List of primary stats such as stamina and added
     * elemental damage.
     * @param effects - List of associated effects.
     * @param armor - Armor value.
     * @param equipment_slot - Slot where item is equipped.
     * @param equipment_type - Type of item.
     * @param damage_range - The range of damage values the item can do.
     * @param swing_speed - Time in seconds between each attack.
     * @param dps - Average damage done per second.
     */
    public constructor(id: string,
                       name: string,
                       href: string,
                       thumbnail_href: string,
                       quality_color: string,
                       unique: boolean,
                       binds_on: ItemBinding,
                       begins_quest?: Quest,
                       class_restrictions?: CharacterClass[],
                       level_requirement?: number,
                       durability?: number,
                       primary_stats?: string[],
                       effects?: Effect[],
                       armor?: number,
                       equipment_slot?: string,
                       equipment_type?: string,
                       damage_range?: {low: number, high: number},
                       swing_speed?: number,
                       dps?: number,
                       flavor_text?: string) {
        this.id = id;
        this.name = name;
        this.href = href;
        this.thumbnail_href = thumbnail_href;
        this.quality_color = quality_color;
        this.unique = unique;
        this.binds_on = binds_on;
        this.begins_quest = begins_quest;
        this.class_restrictions = class_restrictions;
        this.level_requirement = level_requirement;
        this.durability = durability;
        this.primary_stats = primary_stats;
        this.effects = effects;
        this.armor = armor;
        this.equipment_slot = equipment_slot;
        this.equipment_type = equipment_type;
        this.damage_range = damage_range;
        this.swing_speed = swing_speed;
        this.dps = dps;
        this.flavor_text = flavor_text;
    }

    /**
     * Builds a discord markdown compatible string with correctly formatted
     * attributes in accordance with the standard tooltip layout. Should be used
     * for adding a description field to a discord RichEmbed message.
     *
     * @returns {string} - Item tooltip.
     */
    public build_message_description(): string {
        // Equipment type and slot.
        // A more humanly readble tooltip is added here since the tooltip does
        // not support DOM styling such as float: right or tables. For instance
        // a "Sword" of equipment_type "Two-hand" becomes "Two-handed Sword".
        const equipment_formatted = this.equipment_slot && this.equipment_type
            ? `${equipment_str(this.equipment_slot, this.equipment_type)}\n`
            : this.equipment_slot ? `${this.equipment_slot}\n` : ""; 

        // Damage.
        const dmg_formatted = this.damage_range && this.swing_speed && this.dps
            // Damage in the discord tooltip will all be in a single line of
            // text, since it does not support DOM styling such as float: right
            // or tables. Instead a single line represents all the physical
            // damage stats. Added elemental damage can still occur in the list
            // of item stats.
            ? `**${this.damage_range.low} - ${this.damage_range.high}**`
              + ` damage every `
              + `**${this.swing_speed}** seconds (`
              + `**${this.dps}** damage per second)\n`
            : "";

        // Various stats such as added damage, stamina and agility.
        const has_stats = !!this.primary_stats
            && this.primary_stats.length > 0;
        const stats_formatted = has_stats
            ? `${this.primary_stats.map((s) => {
                // Some items have added damage as a stat and since other damage
                // is already bold, damage stats should also be made bold here.
                return s = s.includes("Damage") ? `**${s}**` : s;
            }).join("\n")}\n`
            : "";

        // Durability.
        const durability_formatted = this.durability
            // Format durability as "Durability: durability / durability".
            ? `Durability: ${this.durability} / ${this.durability}\n`
            : "";

        // Class restrictions.
        const has_class_restrictions = this.class_restrictions
            && this.class_restrictions.length > 0;
        const class_restrictions = has_class_restrictions
            ? `Classes: ${this.class_restrictions.map((c) => {
                // Add an underlineto the class links.
                return `__${c}__`;
            }).join(" ")}\n`
            : "";

        // Level requirements.
        const level_requirement_formatted = this.level_requirement
            ? `Requires level ${this.level_requirement}\n`
            : "";

        // Effects short description.
        const effects_short_formatted = this.effects && this.effects !== []
            // Large effect texts take up a lot of tooltip real estate, which
            // is solved by moving them to a seperate message. There should
            // however still be a short entry with the effect trigger and name
            // present in the description, which is generated by the effect
            // function `as_short_tooltip`.
            // Non-complex effects such as added hit % or spellpower will not
            // need their own message and are kept in full.
            ? `\n${this.effects.map((e) => {
                    return `[${e.as_short_tooltip()}](${e.href})`;
                }).join("\n")}`
            : "";

        return `${this.binds_on ? `${this.binds_on}\n` : ""}`
            + `${this.unique ? "Unique\n" :  ""}`
            + `${this.begins_quest ? `${this.begins_quest.to_md()}\n` : ""}`
            + `${equipment_formatted}`
            + `${dmg_formatted}`
            + `${this.armor ? `${this.armor} Armor\n` : ""}`
            + `${stats_formatted}`
            + `${durability_formatted}`
            + `${class_restrictions}`
            + `${level_requirement_formatted}`
            + `${effects_short_formatted}`.trim();
    }

    /**
     * Constrcuts a list of discord RichEmbed messages, which can be sent to a
     * channel to represent the item.
     *
     * @returns {RichEmbed[]} - List of messages.
     */
    public async build_messages(): Promise<RichEmbed[]> {
        const effects = Promise.all(this.effects.filter((e) => {
            // Filter out all the miscellaneous effects, which should not be
            // shown as a seperate message.
            return e.thumbnail_href !== misc_icon;
        }).map((e) => {
            // Build the RichEmbed message for each non-miscellaneous effect
            // of this item.
            return e.build_message(this.quality_color);
        }));
        return [new RichEmbed()
            .setColor(this.quality_color)
            .setTitle(this.name)
            .setDescription(this.build_message_description())
            .setAuthor("Classic DB Bot", favicon_path, discord_href)
            .setThumbnail(this.thumbnail_href)
            .setFooter("https://discord.gg/mRUEPnp", discord_icon)
            .setURL(this.href), ...await effects];
    }

}
