/**
 * @fileoverview Handles message parsing for the discord bot.
 * @author Andreas Kruhlmann
 * @since 1.0.0
 */
const request = require("request-promise");
const discord = require("discord.js");
const path = require("path");
const Nightmare = require("nightmare");
const screenshot = require("nightmare-screenshot");

const item_quality_colors = {
    6: 0xe5cc80, // Artifact
    5: 0xff8000, // Legendary
    4: 0xa335ee, // Epic.
    3: 0x0070dd, // Rare.
    2: 0x1EFF00, // Uncommon.
    1: 0x9d9d9d, // Poor.
}

function build_item_image(item_id) {
    new Nightmare()
        .goto(`https://classicdb.ch/?item=${item_id}`)
        .use(screenshot.screenshotSelector(path.join(process.cwd(), 'test.png'), `div[id=tooltip${item_id}-generic]`, error => {
            console.error(error)
        }))
        .run(() => {
            console.log("done")
        });
}

function find_first_item_index(item_details) {
    for (var i in item_details) {
        if (item_details[i][0] === 3) return i;
    }
    return -1;
}

function build_rich_message(item) {
    build_item_image(item.id)
    console.log(item.img)
    let rich_message = new discord.RichEmbed()
        .setColor(item_quality_colors[item.quality])
        .setTitle(item.name)
        .setDescription(``)
        .setAuthor("Classic DB", "https://i.imgur.com/CpYEwzM.png", `https://classicdb.ch/?item=${item.id}`)
        .setThumbnail(item.img)
        .setImage("https://i.imgur.com/XfVcNB6.png")
        .setFooter("https://github.com/Kruhlmann/classicdb_bot", "https://cdn1.iconfinder.com/data/icons/smallicons-logotypes/32/github-512.png")
        .setTimestamp()
        .setURL(`https://classicdb.ch/?item=${item.id}`);
    return rich_message;
}

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

function get_item_request(msg_content) {
    let matches = msg_content.match(/\[(.*?)\]/);
    if (!matches || matches.length < 2) return "";
    return matches[1];
}

module.exports = {
    get_message_response: get_message_response
}