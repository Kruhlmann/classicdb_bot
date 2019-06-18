/**
 * @fileoverview Class definition for Quest.
 * @author Andreas Kruehlmann
 * @since 1.2.0
 */

import * as cheerio from "cheerio";
import * as request from "request-promise";
import * as config from "../../config.json";

export class Quest {
    /**
     * Generates a Quest object from a quest ID.
     *
     * @async
     * @param id - Database quest id.
     * @returns - Generated Quest object.
     */
    public static async from_id(id: string): Promise<Quest> {
        const url = `${config.host}/?quest=${id}`;
        const html = await request(url);
        const $ = cheerio.load(html);
        const name = $("div.text").find("h1").first().text();
        return new Quest(id, name, `${config.host}/?quest=${id}`);
    }

    public id: string;
    public name: string;
    public href: string;

    /**
     * Constructor
     *
     * @constructor
     * @param id - Database quest id.
     * @param name - Quest name.
     * @param href - Database website URL.
     */
    public constructor(id: string, name: string, href: string) {
        this.id = id;
        this.name = name;
        this.href = href;
    }

    /**
     * Builds a markdown representation of the quest.
     *
     * @returns - Markdown link.
     */
    public to_md(): string {
        return `Begins quest: **[${this.name}](${this.href})**`;
    }
}
