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
    let response_promise = parser.get_message_response(message.content);
    if (!response_promise) return;

    // Handle message recieved.
    response_promise.then(response => {
        if (!response) return;
        message.channel.send({embed: response}).catch(e => lib.on_error(e));
    }).catch(e => lib.on_error(e));
});

// Authenticate.
discord_client.login(config.discord_bot_token).catch(error => {
    lib.on_error(`Error during discord authentication: ${error}`);
});