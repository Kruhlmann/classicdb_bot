/**
 * @fileoverview Main entry point for application.
 * @author Andreas Kruhlmann
 * @since 1.2.0
 */

import * as sentry from "@sentry/node";
import * as discord from "discord.js";
import { RichEmbed } from "discord.js";
import * as config from "../config.json";
import { handle_exception, log } from "./io";
import { get_channel_identity } from "./lib.js";
import { get_message_responses } from "./parser/parser.js";

// Init discord virtual client.
const discord_client = new discord.Client();
const dicord_token = config.deployment_mode === "production"
    ? config.discord_bot_token.production
    : config.discord_bot_token.development;

// Initialize error reporting.
sentry.init({dsn: config.sentry_dsn});

log(`Running classicdb_bot in ${config.deployment_mode} mode`);

// On message recieved behavior.
discord_client.on("message", async (message) => {
    const author = `${message.author.username}@${message.author.id}`;
    const {channel_name, guild_name} = get_channel_identity(message.channel,
                                                            author);

    if (message.content.toLowerCase().includes("[26 dps]")) {
        /* tslint:disable-next-line:max-line-length */
        message.channel.send("Don't justify these peons with a response Tips. They're probably a bunch of trash private server gamers who will never amount to anything in retail classic. I bet they're in raiding guilds who don't bring 8 mages to every raid in 2019 lul. Try talking to him when your guild can do a 3 hour MC losers.");
        log("Sent [26 dps] tips meme:");
        log(`\tServer:  ${guild_name}`);
        log(`\tChannel: ${channel_name}`);
        log(`\tRequested by: ${message.author.username}`);
        return;
    }

    // Handle message recieved.
    get_message_responses(message.content).then((responses: RichEmbed[]) => {
        if (!responses) {
            return;
        }
        for (const response of responses) {
            message.channel.send({embed: response})
                .catch((error: Error) => handle_exception(error));
        }
        log("Sent item tooltip:");
        log(`\tServer:  ${guild_name}`);
        log(`\tChannel: ${channel_name}`);
        log(`\tRequested by: ${message.author.username}`);
    }).catch((error: Error) => handle_exception(error));
});

// Authenticate.
discord_client.login(dicord_token).catch((error: Error) => {
    handle_exception(error);
});
