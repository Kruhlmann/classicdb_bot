/**
 * @fileoverview Main entry point for program.
 * @author Andreas Kruhlmann
 * @since 1.0.0
 */

const discord = require("discord.js");          // Discord API wrapper.
const config = require("../config");            // Local configuration.
const parser = require("./parser")

// Init discord virtual client.
const discord_client = new discord.Client();

discord_client.on("message", async message => {
    let response = await parser.get_message_response(message.content);
    if (response === "") return;
    message.channel.send({embed: response}).catch(error => {
        console.error(`Error while sending message: ${error}`)
    });
});
// Authenticate.
discord_client.login(config.discord_bot_token).catch(error => {
    console.error(`Error during discord authentication: ${error}`)
});