/**
 * @fileoverview Class definition for Effect.
 * @author Andreask Kruhlmann
 * @since 1.2.0
 */

import * as cheerio from "cheerio";
import { RichEmbed } from "discord.js";
import * as request from "request-promise";
import * as config from "../../config.json";
import { html_tag_regex, misc_icon } from "../consts.js";
import { fetch_thumbnail } from "../lib.js";

export class Effect {

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

    public static async from_effect_html(id: string,
                                         html: string,
                                         trigger: string): Promise<Effect> {
        const $ = cheerio.load(html);
        const tables = $("div.tooltip > table tbody tr td").children("table");

        // First table contains general stats of the effect. Second table
        // contains The effect description.
        const stat_table = tables.get(0);
        const misc_table = tables.get(1);

        // Stats.
        const stats_td = $(stat_table).find("td").first();
        const stat_html_lines = stats_td.html().split(html_tag_regex);

        const range_line = (stat_html_lines.find((line) => {
            const r1 = /[0-9]+ yd range/g;
            const r2 = /Melee Range/g;
            const match = (line || "").match(r1) || (line || "").match(r2);
            return (match || []).length > 0;
        }) || "").split(" ");
        const cast_time_line = (stat_html_lines.find((line) => {
            const r1 = /[0-9]+ sec cast/g;
            const r2 = /Instant/g;
            const match = (line || "").match(r1) || (line || "").match(r2);
            return (match || []).length > 0;
        }) || "").split(" ");

        const name = stats_td.find("a").first().text();
        const thumbnail = await fetch_thumbnail(id, true);
        const range = range_line.length > 1
            ? range_line === ["Melee", "Range"] ? "Melee Range" : range_line[0]
            : null;
        const cast_time = cast_time_line.length > 1
            ? range_line === ["Instant"] ? "Instant" : cast_time_line[0]
            : null;
        const description = $(misc_table).find("span.q").first().text() || "";
        const is_misc = thumbnail === misc_icon;
        return new Effect(id, name, `${config.host}/?item=${id}`, description, thumbnail, trigger, is_misc, cast_time, range);
    }

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
        this.thumbnail_href = thumbnail_href,
        this.trigger_name = trigger_name;
        this.is_misc = is_misc;
        this.cast_time = cast_time;
        this.range = range;
    }

    public as_short_tooltip(): string {
        return this.is_misc
            ? `${this.trigger_name}: ${this.description}`
            : `${this.trigger_name}: ${this.name}`;
    }

    public build_message_description() {
        const cast_time = this.cast_time
            ? this.cast_time === "Instant"
                ? `**${this.cast_time}**\n`
                : `**${this.cast_time} second cast**\n`
            : "";
        const range = this.range
            ? this.range === "Melee"
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
