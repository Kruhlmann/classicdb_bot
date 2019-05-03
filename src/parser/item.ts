/**
 * @fileoverview Class definition for Item.
 * @author Andreask Kruhlmann
 * @since 1.2.0
 */

import * as cheerio from "cheerio";
import { RichEmbed } from "discord.js";
import * as request from "request-promise";
import * as config from "../../config.json";
import { favicon_path, github_icon } from "../consts.js";
import { handle_exception } from "../io";
import { css_class_to_item_quality,
         css_class_to_player_class,
         fetch_thumbnail } from "../lib";
import { CharacterClass, ItemBinding } from "../typings/types";
import { Effect } from "./effect";
import { equipment_str } from "./parserutils";

export class Item {
    public static async from_table(id: string,
                                   href: string,
                                   effects: Effect[],
                                   table: Cheerio): Promise<Item> {
        const html_tag_regex = /\s*(<[^>]*>)/g;
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
        const binds_on = html.includes("<br>Binds when picked up<br>")
            ? ItemBinding.ON_PICKUP
            : html.includes("<br>Binds when equipped up<br>")
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

    public static async from_tooltip(id: string,
                                     href: string,
                                     html: string): Promise<Item> {
        const $ = cheerio.load(html);
        const tables = $("div.tooltip > table tbody tr td").children("table");

        // First table contains raw stats of the item. Second table contains
        // spells, set bonuses and flavor text.
        const stat_table = tables.get(0);
        const misc_table = tables.get(1);
        const effects = Effect.from_table(misc_table);

        return Item.from_table(id, href, effects, $(stat_table));
    }

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
     * @param name
     * @param href
     * @param quality_color
     * @param thumbnail_href
     * @param unique
     * @param binds_on
     * @param class_restrictions
     * @param level_requirement
     * @param durability
     * @param primary_stats
     * @param effects
     * @param armor
     * @param equipment_slot
     * @param equipment_type
     * @param damage_range
     * @param swing_speed
     * @param dps
     */
    public constructor(id: string,
                       name: string,
                       href: string,
                       thumbnail_href: string,
                       quality_color: string,
                       unique: boolean,
                       binds_on: ItemBinding,
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

    public build_message_description(): string {
        // Equipment type and slot.
        // A more humanly readble tooltip is added here since the tooltip does
        // not support DOM styling such as float: right or tables. For instance
        // a "Sword" of equipment_type "Two-hand" becomes "Two-handed Sword".
        const equipment_formatted = this.equipment_slot && this.equipment_type
            ? `${equipment_str(this.equipment_slot, this.equipment_type)}\n`
            : "";

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
        const stats_formatted = this.primary_stats && this.primary_stats !== []
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
            ? `\n${this.effects.map((e) => e.as_short_tooltip()).join("\n")}`
            : "";

        return `${this.binds_on ? `${this.binds_on}\n` : ""}`
            + `${this.unique ? "Unique\n" :  ""}`
            + `${equipment_formatted}`
            + `${dmg_formatted}`
            + `${this.armor ? `${this.armor} Armor` : ""}`
            + `${stats_formatted}`
            + `${durability_formatted}`
            + `${class_restrictions}`
            + `${level_requirement_formatted}`
            + `${effects_short_formatted}`.trim();
    }

    public build_messages(): RichEmbed[] {
        return [new RichEmbed()
            .setColor(this.quality_color)
            .setTitle(this.name)
            .setDescription(this.build_message_description())
            .setAuthor("Classic DB", favicon_path, this.href)
            .setThumbnail(this.thumbnail_href)
            .setFooter("https://discord.gg/mRUEPnp", github_icon)
            .setURL(this.href)];
    }

}
