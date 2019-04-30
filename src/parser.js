/**
 * @fileoverview Handles message parsing for the discord bot.
 * @author Andreas Kruhlmann
 * @since 1.0.0
 */

const request = require("request-promise");
const discord = require("discord.js");
const config = require("../config");
const lib = require("./lib");

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
        uri: `${config.classicdb_stub}/opensearch.php?search=${query}`,
        json: true
    }).then(async result => {
        if (result === []) return;
        const item_names = result[1];
        const item_details = result[7];
        const first_item_index = find_first_item_index(item_details);
        if (first_item_index === -1) return;

        const item_id = item_details[first_item_index][1];
        const item_name = item_names[first_item_index].replace(" (Item)", "");
        const item_quality = item_details[first_item_index][3];
        return await lib.parse_item(item_id, item_name, item_quality);
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