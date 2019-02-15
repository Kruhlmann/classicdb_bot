/**
 * @fileoverview Handles message parsing for the discord bot.
 * @author Andreas Kruhlmann
 * @since 1.0.0
 */

const request = require("request-promise");
const discord = require("discord.js");
const fs = require("fs");
const Nightmare = require("nightmare");
const plugin = require("nightmare-screenshot");
const config = require("../config");
const lib = require("./lib");

const item_quality_colors = {
    6: 0xe5cc80, // Artifact
    5: 0xff8000, // Legendary
    4: 0xa335ee, // Epic.
    3: 0x0070dd, // Rare.
    2: 0x1EFF00, // Uncommon.
    1: 0x9d9d9d, // Poor.
};

/**
 * Takes a screenshot of an item tooltip on the classicdb website, and saves
 * it to the disk. The image is saved as `img/${item_id}.png`. Function is sync
 * so the image can be accessed immediately after running.
 *
 * @param {number} item_id - ID of the item to build an image from.
 */
function build_item_images(item_id) {
    let tooltip_path = `${config.output_dir}/${config.tooltip_cache_dir}/${item_id}.png`;
    let thumbnail_path = `${config.output_dir}/${config.thumbnail_cache_dir}/${item_id}.png`;

    // Check if tooltip file already exists.
    if (!fs.existsSync(tooltip_path)) {
        let html_selector = `div[id=tooltip${item_id}-generic]`;
        new Nightmare()
            // Setting a large viewport size ensures the entire tooltip can be seen.
            .viewport(2000, 2000)
            .goto(`https://classicdb.ch/?item=${item_id}`)
            .use(plugin.screenshotSelector(tooltip_path, html_selector, lib.on_error))
            .run();
    }
    // Check if thumbnail file already exists.
    if (!fs.existsSync(thumbnail_path)) {
        let html_selector = `div[id=icon${item_id}-generic]`;
        new Nightmare()
            // Setting a large viewport size ensures the entire tooltip can be seen.
            .viewport(2000, 2000)
            .goto(`https://classicdb.ch/?item=${item_id}`)
            .use(plugin.screenshotSelector(thumbnail_path, html_selector, lib.on_error))
            .run();
    }
}

/**
 * Finds the first item in the list with item type 3 (Item)
 *
 * @param {Array<Array<number>>} item_details - List of item details; id,
 * quality, item type and thumbnail.
 * @returns {number} - Index of the item if found, else -1.
 */
function find_first_item_index(item_details) {
    for (var i in item_details) {
        if (item_details[i][0] === 3) return i;
    }
    return -1;
}

/**
 * Builds a discord RichEmbed message object from an item.
 *
 * @param {{id: number, name: string, img: string, quality: number}} item -
 * Item to build message around.
 * @param {string} description - Optional description for the message object.
 * @returns {discord.RichEmbed} - Rich message object.
 */
function build_rich_message(item, description) {
    if (!description) description = "";
    let favicon_path = "http://kruhlmann-code.com:8080/classicdb_bot/icon.png";
    let item_href = `https://classicdb.ch/?item=${item.id}`;
    let github_icon = "http://kruhlmann-code.com:8080/classicdb_bot/github.png";
    let github_href = "https://github.com/Kruhlmann/classicdb_bot";

    try {
        build_item_images(item.id);
    } catch (e) {
        // An error will occur if the id is invalid.
        return;
    }

    let rich_message = new discord.RichEmbed()
        .setColor(item_quality_colors[item.quality])
        .setTitle(item.name)
        .setDescription(description)
        .setAuthor("Classic DB", favicon_path, item_href)
        .setThumbnail(`${config.http_assets_stub}/thumbnail_cache/${item.id}.png`)
        .setImage(`${config.http_assets_stub}/tooltip_cache/${item.id}.png`)
        .setFooter(github_href, github_icon)
        .setURL(item_href);
    return rich_message;
}

/**
 * Test whether a string is a representation of a numerical integet.
 *
 * @param {string} str - String to test.
 * @returns {boolean} - True if string represents a numerical integer.
 */
function is_string_numerical_int(str) {
    let type_string = typeof str === "string";
    let regex_match = /^[-+]?[1-9]{1}\d+$|^[-+]?0$/.test(str);
    return type_string && regex_match;
}

function build_message_from_query(query) {
    return request({
        uri: `https://classicdb.ch/opensearch.php?search=${query}`,
        json: true
    }).then(result => {
        if (result === []) return;
        let item_names = result[1];
        let item_details = result[7];
        let first_item_index = find_first_item_index(item_details);
        if (first_item_index === -1) return;

        let found_item = {
            id: item_details[first_item_index][1],
            name: item_names[first_item_index].replace(" (Item)", ""),
            quality: item_details[first_item_index][3]
        };
        return build_rich_message(found_item, `Result for "${query}"`);
    });
}

function build_message_from_id() {
}

/**
 * Builds a rich message response if the user requested an item.
 *
 * @param {string} message_content - Content of the message recieved.
 * @returns {Promise<discord.RichEmbed|undefined>} - Rich message object if no
 * error occurred else undefined.
 */
function get_message_response(message_content) {
    let match = get_item_request(message_content);
    if (!match) return;
    // If the match is an id build the message with that in mind.
    return is_string_numerical_int(match)
        ? build_message_from_id(match)
        : build_message_from_query(match);
}

/**
 * Finds potential search matches for [item_name].
 *
 * @param {string} msg_content - Content of the message to parse.
 * @returns {string|undefined} - First match if any were found else undefined.
 */
function get_item_request(msg_content) {
    let matches = msg_content.match(/\[(.*?)\]/);
    if (!matches || matches.length < 2) return;
    return matches[1];
}

module.exports = {
    get_message_response: get_message_response
};