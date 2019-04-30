/**
 * @fileoverview Project wide functions.
 * @author Andreas Kruhlmann
 * @since 1.0.0
 */
const sentry = require("@sentry/node");
const config = require("../config");
const fs = require("fs");
const request = require("request-promise");
const cheerio = require("cheerio");
const discord = require("discord.js");

const favicon_path = "https://proxy.duckduckgo.com/iu/?u=http%3A%2F%2Forig08.deviantart.net%2F65e3%2Ff%2F2014%2F207%2Fe%2F2%2Fofficial_wow_icon_by_benashvili-d7sd1ab.png&f=1";
const github_icon = "https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn4.iconfinder.com%2Fdata%2Ficons%2Ficonsimple-logotypes%2F512%2Fgithub-512.png&f=1";
const github_href = "https://github.com/Kruhlmann/classicdb_bot";
const item_quality_colors = {
    6: 0xe5cc80, // Artifact
    5: 0xff8000, // Legendary
    4: 0xa335ee, // Epic.
    3: 0x0070dd, // Rare.
    2: 0x1EFF00, // Uncommon.
    1: 0x9d9d9d, // Poor.
};
const root_tables_q = "div.tooltip > table > tbody > tr > td";
const wpn_types = [
    "dagger",
    "mace",
    "sword",
    "wand",
    "staff",
    "polearm",
    "axe",
    "fishing pole",
    "fist weapon",
    "bow",
    "crossbow",
    "gun",
    "thrown",
    "miscellaneous",
];
const wpn_slots_suffix = [
    "two-hand",
    "one-hand",
];

const armor_types = [
    "head",
    "neck",
    "shoulder",
    "chest",
    "hands",
    "wrist",
    "waist",
    "legs",
    "feet",
];

// Init error reporting.
sentry.init({dsn: config.sentry_dsn});

/**
 * Simple generic error handling.
 *
 * @param {Error|string} error - Error occurred.
 */
function on_error (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    // Don't spam sentry during development.
    if (config.deployment_mode === "production") {
        sentry.captureException(error);
    }
}

function fetch_thumbnail(id, spell = false) {
    const url = `${config.classicdb_stub}/?${spell ? "spell" : "item"}=${id}`;
    return request(url).then((html) => {
        const split_dom = html.split("\n").filter((node) => {
            return node.includes("Icon.create");
        });
        const split_js = split_dom[0].trim().split("Icon.create");
        const icon = split_js[split_js.length - 1].split("'")[1];
        const stub = `${config.classicdb_stub}/images/icons/large`;
        return `${stub}/${icon.toLowerCase()}.jpg`;
    }).catch(error => console.error("err"));
}

function parse_spell_details(html) {
    const $ = cheerio.load(html);
    const details_table = $("div.tooltip > table > tbody > tr > td");
    const stats_table = details_table.children("table").first();

    const name = stats_table.find("a").first().text();
    const desc = details_table.children("table").find(".q").first().text();
    return {
        desc,
        name,
    };
}

async function parse_spells_table(spells_table, $) {
    const spells = [];
    const q = "tbody > tr > td";
    const children = $(spells_table).find(q).children(".q2");
    for (let i = 0; i < children.length; i++) {

        const spell_node = $(children.get(i));
        const spell_href_node = spell_node.find("a");
        if (!spell_href_node) {
            return;
        }

        const spell_href_stub = spell_href_node.attr("href");
        const spell_trigger = spell_node.html().replace(spell_href_node.html(), "");
        const spell_id = spell_href_stub.replace("?spell=", "");
        const spell_href = `${config.classicdb_stub}/${spell_href_stub}`;
        const thumbnail_href = await fetch_thumbnail(spell_id, true);

        const html = await request(spell_href);
        const spell_details = parse_spell_details(html);

        spells.push({
            id: spell_id,
            text: spell_node.text(),
            href: spell_href,
            desc: spell_details.desc,
            name: spell_details.name,
            thumbnail: thumbnail_href,
            trigger: spell_trigger,
        });
    }
    return spells;
}

function eq_slot_str(slot, eq_type) {
    if (wpn_types.includes(eq_type.toLowerCase())) {
        return wpn_slots_suffix.includes(slot.toLowerCase())
            ? [`${slot}ed **${eq_type}**`]
            : [`${slot} **${eq_type}**`];
    }
    return [];
}

function parse_stats_table(stats_table, $) {
    const q = "tbody > tr > td";
    let stats = [];

    $(stats_table).find(q).children("table").each((_, e) => {
        const inner_tbl = $(e);
        const e1 = $(inner_tbl.find("tbody").find("tr").find("td")).text();
        const e2 = $(inner_tbl.find("tbody").find("tr").find("th")).text();

        if (wpn_types.includes(e2.toLowerCase())) {
            stats = [...stats, ...eq_slot_str(e1, e2)];
        } else if (armor_types.includes(e1.toLowerCase())) {
            stats = [...stats, `${e2} ${e1}`];
        } else if (e1.includes("Damage")) {
            const weapon_damage = e1.replace("Damage", "");
            const attack_interval = e2.replace("Speed", "");
            stats.push(`**${weapon_damage.trim()} damage** every **${attack_interval}** seconds`);
        }
        $(stats_table).html($(stats_table).html().replace(inner_tbl.html(), ""));
    });

    const prune_regex = /<table width="100%">.*?<\/table>/g;
    const pruned_html = $(stats_table).html().replace(prune_regex, "<br>");
    const split_html = pruned_html.split("<br>").filter((node) => {
        return node.trim() !== "" && node.charAt(0) !== "<";
    });

    const splice_index = split_html.includes("Unique")
        ? 2
        : 1;
    stats.splice(splice_index, 0, ...split_html);
    return stats;
}

function create_spell_stats(spells) {
    return [];
}

async function parse_tooltip(html) {
    const $ = cheerio.load(html);
    const tables = $(root_tables_q).children("table");
    const stats_table = tables.get(0);
    const spells_table = tables.get(1);

    const spells = await parse_spells_table(spells_table, $);
    const stats = parse_stats_table(stats_table, $);
    for (const spell of spells) {
        stats.push(`[${spell.text.split(":")[0]}: ${spell.name}](${spell.href})`);
    }

    return {
        spells,
        stats
    };
}

function create_stats_message(item) {
    return new discord.RichEmbed()
        .setColor(item_quality_colors[item.quality])
        .setTitle(item.name)
        .setDescription(item.stats.join("\n"))
        .setAuthor("Classic DB", favicon_path, item.href)
        .setThumbnail(item.thumbnail)
        .setFooter(github_href, github_icon)
        .setURL(item.href);
}

function create_spell_messages(item) {
    const messages = [];
    for (const spell of item.spells) {
        messages.push(new discord.RichEmbed()
            .setColor(item_quality_colors[item.quality])
            .setTitle(spell.name)
            .setDescription(`*${spell.desc}*`)
            .setThumbnail(spell.thumbnail)
            .setURL(spell.href));
    }
    return messages;
}

async function parse_item(item_id, item_name, item_quality) {
    return request({
        uri: `${config.classicdb_stub}/?item=${item_id}`,
    }).then(async (html) => {

        const tooltip = await parse_tooltip(html);
        const item = {
            id: item_id,
            href: `${config.classicdb_stub}/?item=${item_id}`,
            name: item_name,
            quality: item_quality,
            stats: tooltip.stats,
            spells: tooltip.spells,
            thumbnail: await fetch_thumbnail(item_id)
        };
        const stats_message = create_stats_message(item);
        const spell_messages = create_spell_messages(item);
        return [stats_message, ...spell_messages];
    }).catch((error) => {
        console.log(error)
    });
}

/**
 * Simple debugger.
 *
 * @param {string} message - Message.
 */
function on_debug (message) {
    // eslint-disable-next-line no-console
    console.log(message);
}

/**
 * Checks a file's existance. If the file does not initially exists keep
 * checking until the specified timeout is reached.
 *
 * @param {string} path - Path of file to watch.
 * @param {number} timeout - MS before promise is rejected.
 * @returns {Promise<Error|undefined>}
 */
function file_exists_promise(path, timeout) {
    return new Promise(function (resolve, reject) {

        var timer = setTimeout(function () {
            watcher.close();
            reject(new Error("file_exists_promise timed out."));
        }, timeout);

        fs.access(path, fs.constants.R_OK, function (err) {
            if (!err) {
                clearTimeout(timer);
                watcher.close();
                resolve();
            }
        });

        const dir = path.dirname(path);
        const basename = path.basename(path);
        const watcher = fs.watch(dir, function (eventType, filename) {
            if (eventType === "rename" && filename === basename) {
                clearTimeout(timer);
                watcher.close();
                resolve();
            }
        });
    });
}

module.exports = {
    on_error,
    on_debug,
    file_exists_promise,
    parse_item,
};