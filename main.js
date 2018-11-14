/**
 * @author Andreas Kruhlmann
 * @fileoverview Main entry point for program.
 * @since 1.0.0
 */
  
const moment = require("moment");               // Datetime.
const request = require("request-promise");     // HTTP(S) requests.
const cheerio = require("cheerio");             // DOM scraper.
const discord = require("discord.js");          // Discord API wrapper.
const fs = require("fs");                       // Filesystem.
const config = require("./config.js");          // Local configuration.

const raid_splash = {
    "Onyxia's Lair": "https://vignette3.wikia.nocookie.net/wowwiki/images/4/46/Onyxia's_Lair_loading_screen.jpg",
    "Molten Core": "https://mmogamerchick.files.wordpress.com/2012/12/molten-core.jpg",
    "Blackwing Lair": "http://www.halona-zat.com/archive/halona/fbk/blackwing-lair/zone-maps/loading_screen.jpg",
    "Zul'Gurub": "https://vignette.wikia.nocookie.net/wowwiki/images/1/12/Zul'Gurub_loading_screen.jpg",
    "Ruins of Ahn'Qiraj": "http://www.halona-zat.com/archive/halona/fbk/ruins-of-ahn-qiraj/zone-maps/loading_screen.jpg",
    "Ahn'Qiraj": "https://img3.wikia.nocookie.net/__cb20110218023037/wowwiki/images/6/6a/Temple_of_Ahn'Qiraj_loading_screen.jpg",
    "Naxxramas": "https://i.imgur.com/UwSR0Hd.jpg"
}

const raid_colors = {
    "Onyxia's Lair": 0xcc0000,
    "Molten Core": 0xe63900,
    "Blackwing Lair": 0x330000,
    "Zul'Gurub": 0x29bf00,
    "Ruins of Ahn'Qiraj": 0x7500bf,
    "Ahn'Qiraj": 0x641887,
    "Naxxramas": 0x3027aa
}

 // Init discord virtual client.
 const discord_client = new discord.Client();

// Add client events.
discord_client.once("ready", () => console.log("Discord virtual client initialized."));
discord_client.on("message", message => {
    var args = message.content.slice(1).split(" ");
    var command = args.shift().toLowerCase();
    if(command === "track" && args.length > 0) {
        var guild_names = JSON.parse(fs.readFileSync("./guilds.json"));
        var tracked_guild = args[0]
        var channel_id = message.channel.id;
        var server_id = message.guild.id;
        
        request({uri: `https://legacyplayers.com/API.aspx`, qs: {type: 3, Arg1: tracked_guild}, json: true}).then(response => {
            if(!guild_names.hasOwnProperty(response.Name)) guild_names[response.Name] = [];
            if(!guild_names[response.Name].includes({"server_id": server_id, "channel_id": channel_id})) {
                guild_names[response.Name].push({"server_id": server_id, "channel_id": channel_id});
                message.channel.send(`Started tracking legacy logs for **<${response.Name}>**`);
            } else message.channel.send(`Already tracking legacy logs for **<${response.Name}>**`);
        }).catch(error => console.error(error)).finally(() => fs.writeFileSync("./guilds.json", JSON.stringify(guild_names)));
}
});
// Authenticate.
discord_client.login(config.discord_bot_token).catch(error => console.error(`Error during discord authentication: ${error}`));

// Run this on an interval to update discord channels with new data from legacyplayers.
var update_raids = () => {
    /**
     * Returns a list of raid events from the 1st page of legacyplayers in JSOn format.
     * @param {String} guild_name - Name of target guild. Case insensitive.
     * @return {Promise.<Array[Object]>} - Resultng promise with list of JSON objects containing raid event data.
     */
    var get_raids_page = guild_name => {
        return request({uri: `https://legacyplayers.com/Raids/Default.aspx`, qs: {name: guild_name, page: 0, exp: 0}, headers: {"accept": "*/*", "user-agent": "*"}}).then(response => {
            var raid_events = [];    
            var $ = cheerio.load(response);
            //console.log($("table#overview tr").text())
            $("table#overview").find("tr").each((i, tr) => {
                if(i > 0) { // Skip first header row.
                    var row_data = [];
                    $(tr).find("td").each((i, td) => row_data.push($(td)));
                    var raid_event = {
                        id: row_data[0].text(),
                        guild_id: row_data[1].find("a").attr("href").split("=")[1],
                        guild_name: guild_name,
                        href: "https://legacyplayers.com" + row_data[2].find("a").attr("href"),
                        instance_name: row_data[2].find("a").text(),
                        date_start: moment(row_data[3].text().split(" ")[0], "MM/DD/YYYY").format("LL"),
                        time_start: row_data[3].text().split(" ")[1] + " " + row_data[4].text().split(" ")[2],
                        date_end: moment(row_data[4].text().split(" ")[0], "MM/DD/YYYY").format("LL"),
                        time_end: row_data[4].text().split(" ")[1] + " " + row_data[4].text().split(" ")[2],
                        duration: row_data[5].text(),
                        realm: row_data[6].text(),
                    }
                    raid_events.push(raid_event);
                }
            });
            return raid_events;
        }).catch(error => console.error(error));
    }

    var raid_cache = JSON.parse(fs.readFileSync("./raid_cache.json"));
    var guild_configuration = JSON.parse(fs.readFileSync("./guilds.json"));
    var promises = [];

    // Loop all tracked guilds in all channels.
    for(var guild_name in guild_configuration){
        promises.push(get_raids_page(guild_name));
    }
    Promise.all(promises).then(promise_data => {
        for (var raids in promise_data){
            raids = promise_data[raids].reverse();
            // All registered raids in page #0.
            for(var raid in raids){
                raid = raids[raid];
                // Server/channel pair in guilds file.
                for (var server_channel_pair in guild_configuration[raid.guild_name]){
                    server_channel_pair = guild_configuration[raid.guild_name][server_channel_pair];
                    if(!raid_cache.raids.hasOwnProperty(server_channel_pair.channel_id)) raid_cache.raids[server_channel_pair.channel_id] = [];
                    // Cache check.
                    if (!raid_cache.raids[server_channel_pair.channel_id].includes(raid.id)) {
                        raid_cache.raids[server_channel_pair.channel_id].push(raid.id);
                        var rich_message = new discord.RichEmbed()
                            .setColor(raid_colors[raid.instance_name])
                            .setTitle(raid.instance_name)
                            .setDescription(`${raid.instance_name} logs for guild <${raid.guild_name}>\n\n${raid.href}`)
                            .setAuthor("Legacyplayers", "https://i.imgur.com/mqMccO7.png", raid.href)
                            .setImage(raid_splash[raid.instance_name])
                            .setFooter("https://github.com/Kruhlmann", "https://cdn1.iconfinder.com/data/icons/smallicons-logotypes/32/github-512.png")
                            .setTimestamp()
                            .setURL(raid.href)
                            .addField("Date", raid.date_start, true)
                            .addField("Duration", raid.duration, true)
                            .addField("Started", raid.time_start, true)
                            .addField("Ended", raid.time_end, true);
                        discord_client.channels.get(server_channel_pair.channel_id).send({embed: rich_message});
                    }
                }
            }
        }
    }).finally(() => fs.writeFileSync("./raid_cache.json", JSON.stringify(raid_cache)));
}

update_raids();
setInterval(update_raids, 60 * 1000); // 1 minute.
