/**
 * @fileoverview Handles message parsing for the discord bot.
 * @author Andreas Kruhlmann
 * @since 1.0.0
 */

const request = require("request-promise");
const discord = require("discord.js");
const path = require("path");
const Nightmare = require("nightmare");
const plugin = require("nightmare-screenshot");

const item_quality_colors = {
    6: 0xe5cc80, // Artifact
    5: 0xff8000, // Legendary
    4: 0xa335ee, // Epic.
    3: 0x0070dd, // Rare.
    2: 0x1EFF00, // Uncommon.
    1: 0x9d9d9d, // Poor.
}

/**
 * Simple generic error handling.
 * 
 * @param {Error|string} error - Error occurred.
 */
function on_error (error) {
    console.log(error);
}

/**
 * Takes a screenshot of an item tooltip on the classicdb website, and saves 
 * it to the disk. The image is saved as `img/${item_id}.png`. Function is sync
 * so the image can be accessed immediately after running.
 * 
 * @param {number} item_id - ID of the item to build an image from.
 */
function build_item_image(item_id) {
    let output_path = path.join(process.cwd(), `img/${item_id}.png`);
    let html_selector = `div[id=tooltip${item_id}-generic]`;
    new Nightmare()
        .goto(`https://classicdb.ch/?item=${item_id}`)
        .use(plugin.screenshotSelector(output_path, html_selector, on_error))
        .run(() => console.log(`Exported ${output_path}`));
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
 * @returns {discord.RichEmbed} - Rich message object.
 */
function build_rich_message(item) {
    let favicon_path = "https://i.imgur.com/CpYEwzM.png";
    let item_href = `https://classicdb.ch/?item=${item.id}`;
    let github_icon = "https://cdn1.iconfinder.com/data/icons/smallicons-logotypes/32/github-512.png";
    let github_href = "https://github.com/Kruhlmann/classicdb_bot";
    build_item_image(item.id)
    
    let rich_message = new discord.RichEmbed()
        .setColor(item_quality_colors[item.quality])
        .setTitle(item.name)
        .setDescription(``)
        .setAuthor("Classic DB", favicon_path, item_href)
        .setThumbnail(item.img)
        .setImage("https://i.imgur.com/XfVcNB6.png")
        .setFooter(github_href, github_icon)
        .setTimestamp()
        .setURL(item_href);
    return rich_message;
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
    if (match === "") return;
    return request({
        uri: `https://classicdb.ch/opensearch.php?search=${match}`,
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
            img: `https://classicdb.ch/images/icons/large/${item_details[first_item_index][2]}.jpg`,
            quality: item_details[3]
        }
        return build_rich_message(found_item);
    }).catch(error => {
        console.log(`Error: ${error}`);
    });
}

/**
 * Finds potential search matches for [item_name].
 * 
 * @param {string} msg_content 
 * @returns {string} - First match if any were found else an empty string.
 */
function get_item_request(msg_content) {
    let matches = msg_content.match(/\[(.*?)\]/);
    if (!matches || matches.length < 2) return "";
    return matches[1];
}

module.exports = {
    get_message_response: get_message_response
}