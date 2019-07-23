/**
 * @fileoverview Class definition for Effect.
 * @author Andreask Kruhlmann
 * @since 1.2.0
 */

import * as cheerio from "cheerio";
import { RichEmbed } from "discord.js";
import { stat } from "fs";
import * as request from "request-promise";

import * as config from "../../../config.json";
import { html_tag_regex, misc_icon } from "../../consts.js";
import { fetch_thumbnail } from "../../lib.js";

export class Effect {

    /**
     * Generates all effects from a database item tooltip element.
     *
     * @param table - Tooltip HTML as a Cheerio element.
     * @returns - Generated effects.
     */
    public static from_item_table(table: Cheerio): Promise<Effect[]> {
        const $ = cheerio.load(table.html());
        const effects: Array<Promise<Effect>> = [];
        table.find("span.q2").each((_, node) => {
            const h = $(node).find("a").attr("href");
            const id = $(node).find("a").attr("href").replace("?spell=", "");
            const trigger = $(node).text().split(":")[0];
            effects.push(Effect.from_id(id, trigger));
        });
        return Promise.all(effects);
    }

    /**
     * Generates an Effect from the HTML content of an effect database webpage.
     *
     * @async
     * @param id - Database effect id.
     * @param html - Database webpage HTML content.
     * @param trigger - Effect trigger.
     */
    public static async from_effect_html(id: string,
                                         html: string,
                                         trigger: string): Promise<Effect> {
        // Function for finding range and cast speed for an effect.
        const range_and_cast_format = (r1: RegExp,
                                       r2: RegExp,
                                       lines: string[]): string[] =>
            (lines.find((line) => {
                const match = (line || "").match(r1) || (line || "").match(r2);
                return (match || []).length > 0;
            }) || "").split(" ");

        const $ = cheerio.load(html);
        const tables = $("div.tooltip > table tbody tr td").children("table");

        // First table contains general stats of the effect. Second table
        // contains The effect description.
        const stat_table = tables.get(0);
        const misc_table = tables.get(1);

        // Stats.
        const stats_td = $(stat_table).find("td").first();
        const stat_html_lines = stats_td.html().split(html_tag_regex);

        const range_line = range_and_cast_format(/[0-9]+ yd range/,
                                                 /Melee Range/g,
                                                 stat_html_lines);

        const cast_time_line = range_and_cast_format(/[0-9]+ sec cast/g,
                                                     /Instant/g,
                                                     stat_html_lines);

        const name = stats_td.find("a").first().text();
        const thumbnail = await fetch_thumbnail(id, true);
        const range = range_line.length > 1
            ? range_line.includes("Melee") ? "Melee Range" : range_line[0]
            : null;
        const cast_time = cast_time_line[0] || null;
        const description = $(misc_table).find("span.q").first().text() || "";
        const is_misc = thumbnail === misc_icon;
        return new Effect(id, name, `${config.host}/?spell=${id}`, description, thumbnail, trigger, is_misc, cast_time, range);
    }

    /**
     * Generates an item based on an effect id and a trigger.
     *
     * @async
     * @param id - Database effect id.
     * @param trigger - Effect trigger.
     * @returns - Generated effect.
     */
    public static async from_id(id: string, trigger: string): Promise<Effect> {
        const url = `${config.host}/?spell=${id}`;
        const html = await request(url);
        return Effect.from_effect_html(id, html, trigger);
    }

    public id: string;
    public name: string;
    public href: string;
    public description: string;
    public thumbnail_href: string;
    public trigger_name: string;
    public is_misc: boolean;
    public cast_time: string;
    public range: string;

    /**
     * Constructor
     *
     * @param id - Database effect id.
     * @param name - Effect name.
     * @param href - Database website link.
     * @param description - Full effect description.
     * @param thumbnail_href - Link to effect thumbnail.
     * @param trigger_name - Type of trigger associated with the effect. This
     * can be different for the same effect as it is specified on a pre-item
     * basis.
     * @param is_misc - Whether the effect is a miscellaneous effect.
     * Miscellaneous effects are represented by the cog thumbnail and are
     * typically smaller effects that do not need their own RichEmbed message to
     * be displayed with an item.
     * @param cast_time - Cast time of effect.
     * @param range - The maximum range of the effect.
     */
    public constructor(id: string,
                       name: string,
                       href: string,
                       description: string,
                       thumbnail_href: string,
                       trigger_name: string,
                       is_misc: boolean,
                       cast_time: string,
                       range: string) {
        this.id = id;
        this.name = name;
        this.href = href;
        this.description = description;
        this.thumbnail_href = thumbnail_href;
        this.trigger_name = trigger_name;
        this.is_misc = is_misc;
        this.cast_time = cast_time;
        this.range = range;
    }

    /**
     * Generates a summary of the effect based on whether it's a miscellaneous
     * effect. Used inside the item tooltip stats region.
     *
     * @returns Short effect summary.
     */
    public as_short_tooltip(): string {
        return this.is_misc
            ? `${this.trigger_name}: ${this.description}`
            : `${this.trigger_name}: ${this.name}`;
    }

    /**
     * Generates the description part of a RichEmbed message for the effect.
     * This includes the name, cast time, maximum range and full effect
     * description.
     *
     * @returns Generated RichEmbed description.
     */
    public build_message_description(): string {
        const cast_time = this.cast_time
            ? this.cast_time === "Instant"
                ? `**${this.cast_time}**\n`
                : `**${this.cast_time} second cast**\n`
            : "";
        const range = this.range
            ? this.range === "Melee Range"
                ? `**${this.range}**\n`
                : `**${this.range} yards range**\n`
            : "";
        return `${range}`
            + `${cast_time}`
            + `${this.description}`;
    }

    /**
     * Constrcuts a discord RichEmbed message, which can be sent to a channel to
     * represent the effect.
     *
     * @param color - Color of the RichEmbed message.
     * @returns - Generated discord RichEmbed message for this effect.
     */
    public build_message(color: string): RichEmbed {
        return new RichEmbed()
            .setColor(color)
            .setTitle(this.name)
            .setDescription(this.build_message_description())
            .setThumbnail(this.thumbnail_href)
            .setURL(this.href);
    }
}
