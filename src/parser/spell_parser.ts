// /**
//  * @fileoverview Handles spell message parsing.
//  * @author Andreas Kruhlmann
//  * @since 1.2.0
//  */

// import * as config from "../../config.json";
// import * as request from "request-promise";
// import * as cheerio from "cheerio";
// import { fetch_thumbnail } from "../lib.js";
// import { SpellDetails, Spell } from "../typings/types.js";

// /**
//  * Parses the HTML of a spell node and returns the description and name.
//  *
//  * @param {string} html - HTML to parse.
//  * @returns {{desc: string, name: string}} - Parsed data; description and name.
//  */
// export function parse_spell_details(html: string): SpellDetails {
//     const $ = cheerio.load(html);
//     const details_table = $("div.tooltip > table > tbody > tr > td");
//     const stats_table = details_table.children("table").first();

//     const name = stats_table.find("a").first().text();
//     const desc = details_table.children("table").find(".q").first().text();
//     return {
//         desc,
//         name,
//     };
// }

// /**
//  * Parses the spells table of an item and parses all spells.
//  *
//  * @async
//  * @param {CheerioElement} spells_table - Table element containg spells.
//  * @param {CheerioStatic} $ - Cheerio object.
//  * @returns {Promise<Spell[]>} - List of founds spells.
//  */
// export async function parse_spells_table(spells_table: CheerioElement,
//                                          $: CheerioStatic): Promise<Spell[]> {
//     const spells: Spell[] = [];
//     const children = $(spells_table).find("tbody > tr > td").children(".q2");
//     for (let i = 0; i < children.length; i++) {

//         const spell_node = $(children.get(i));
//         const spell_a_node = spell_node.find("a");
//         if (!spell_a_node) {
//             return;
//         }

//         const spell_href_stub = spell_a_node.attr("href");
//         const spell_trgr = spell_node.html().replace(spell_a_node.html(), "");
//         const spell_id = spell_href_stub.replace("?spell=", "");
//         const spell_href = `${config.host}/${spell_href_stub}`;
//         const thumbnail_href = await fetch_thumbnail(spell_id, true);
//         const html = await request(spell_href);
//         const spell_details = parse_spell_details(html);

//         spells.push({
//             desc: spell_details.desc,
//             href: spell_href,
//             id: spell_id,
//             name: spell_details.name,
//             text: spell_node.text(),
//             thumbnail: thumbnail_href || "",
//             trigger: spell_trgr,
//         });
//     }
//     return spells;
// }
