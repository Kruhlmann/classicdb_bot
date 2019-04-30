/**
 * @fileoverview Main entry point for program.
 * @author Andreas Kruhlmann
 * @since 1.0.0
 */

const discord = require("discord.js");
const config = require("../config");
const parser = require("./parser");
const lib = require("./lib");

lib.on_debug("Running classicdb_bot");
lib.on_debug(`\tExport root:\t${config.output_dir}`);
lib.on_debug(`\tTooltip root:\t${config.tooltip_cache_dir}`);
lib.on_debug(`\tThumbnail root:\t${config.thumbnail_cache_dir}`);

// Init discord virtual client.
const discord_client = new discord.Client();

// On message recieved behavior.
discord_client.on("message", async message => {
    if (message.content.toLowerCase().includes("[26 dps]")) {
        message.channel.send("Don't justify these peons with a response Tips. They're probably a bunch of trash private server gamers who will never amount to anything in retail classic. I bet they're in raiding guilds who don't bring 8 mages to every raid in 2019 lul. Try talking to him when your guild can do a 3 hour MC losers.");
        console.log("Sent [26 dps] tips meme:");
        console.log(`\tServer:  ${message.channel.guild.name}`);
        console.log(`\tChannel: ${message.channel.name}`);
        console.log(`\tRequested by: ${message.author}`);
        return;
    }
    let response_promise = parser.get_message_response(message.content);
    if (!response_promise) return;
    try {
        // Handle message recieved.
        response_promise.then(responses => {
            if (!responses) return;
            for (const response of responses) {
                message.channel.send({embed: response}).catch(e => lib.on_error(e));
            }
            console.log("Sent item tooltip:");
            console.log(`\tServer:  ${message.channel.guild.name}`);
            console.log(`\tChannel: ${message.channel.name}`);
            console.log(`\tRequested by: ${message.author}`);
        }).catch(e => lib.on_error(e));
    } catch (error) {
        lib.on_debug("yikes");
    }
});

// Authenticate.
discord_client.login(config.discord_bot_token).catch(error => {
    lib.on_error(`Error during discord authentication: ${error}`);
});
