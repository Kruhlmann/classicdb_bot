/**
 * @fileoverview Main entry point for program.
 * @author Andreas Kruhlmann
 * @since 1.0.0
 */

const discord = require("discord.js");
const config = require("../config");
const parser = require("./parser");
const lib = require("./lib");
const sentry = require("@sentry/node");

// Init error reporting.
sentry.init({dsn: config.sentry_dsn});

// Init discord virtual client.
const discord_client = new discord.Client();

discord_client.on("message", async message => {
    let response_promise = parser.get_message_response(message.content);
    if (!response_promise) return;
    response_promise.then(response => {
        if (!response) return;
        message.channel.send({embed: response}).catch(e => lib.on_error(e));
    }).catch(e => lib.on_error(e));
});
// Authenticate.
discord_client.login(config.discord_bot_token).catch(error => {
    lib.on_error(`Error during discord authentication: ${error}`);
});