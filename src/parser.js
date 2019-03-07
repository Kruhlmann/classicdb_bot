/**
 * @fileoverview Handles message parsing for the discord bot.
 * @author Andreas Kruhlmann
 * @since 1.0.0
 */

const request = require("request-promise");
const discord = require("discord.js");
const config = require("../config");
const lib = require("./lib");
const screenshots = require("./screenshot_builder");
const remote = require("./remote");

const favicon_path = `https://proxy.duckduckgo.com/iu/?u=http%3A%2F%2Forig08.deviantart.net%2F65e3%2Ff%2F2014%2F207%2Fe%2F2%2Fofficial_wow_icon_by_benashvili-d7sd1ab.png&f=1`;
const github_icon = `https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn4.iconfinder.com%2Fdata%2Ficons%2Ficonsimple-logotypes%2F512%2Fgithub-512.png&f=1`;
const github_href = "https://github.com/Kruhlmann/classicdb_bot";

const item_quality_colors = {
    6: 0xe5cc80, // Artifact
    5: 0xff8000, // Legendary
    4: 0xa335ee, // Epic.
    3: 0x0070dd, // Rare.
    2: 0x1EFF00, // Uncommon.
    1: 0x9d9d9d, // Poor.
};

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

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve, ms);
    });
}

/**
 * Builds a discord RichEmbed message object from an item.
 *
 * @param {{id: number, name: string, img: string, quality: number}} item -
 * Item to build message around.
 * @param {string} description - Optional description for the message object.
 * @returns {discord.RichEmbed} - Rich message object.
 */
async function build_rich_message(item, description) {
    if (!description) description = "";
    let item_href = `https://classicdb.ch/?item=${item.id}`;

    try {
        screenshots.build_item_images(item.id);
        await sleep(3000);
        await remote.upload_item_images(item.id);
    } catch (e) {
        // An error will occur if the id is invalid.
        //lib.on_error(`An error occurred while building item images ${e}`);
        lib.on_error(e);
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
    }).then(async result => {
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
        return await build_rich_message(found_item, `Result for "${query}"`);
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