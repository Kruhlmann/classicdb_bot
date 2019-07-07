/**
 * @fileoverview Main entry point for application.
 * @author Andreas Kruhlmann
 * @since 1.2.0
 */

import * as sentry from "@sentry/node";
import * as discord from "discord.js";
import { RichEmbed } from "discord.js";
import * as config from "../config.json";
import { DatabaseHandler } from "./db.js";
import { handle_exception, log } from "./io";
import { execute, get_channel_identity } from "./lib.js";
import { ClassicDBParser } from "./parsers/classicdb/parser.js";
import { ItemizationParser } from "./parsers/itemization/parser.js";
import { LoggingLevel, Parser } from "./typings/types.js";

process.on("uncaughtException", (e: Error) => handle_exception(e));
process.on("unhandledRejection", (e: Error) => handle_exception(e));

(async () => {
    // Init discord virtual client.
    const discord_client = new discord.Client();
    const dicord_token = config.deployment_mode === "production"
        ? config.discord_bot_token.production
        : config.discord_bot_token.development;

    // Init parser.
    const classicdb_parser: Parser = new ClassicDBParser();
    const itemization_parser: Parser = new ItemizationParser();
    let current_parser: Parser;

    // Init database connection.
    await DatabaseHandler.connect(config.database);

    // Initialize error reporting.
    sentry.init({dsn: config.sentry_dsn});

    log("Awaiting response from discord...", LoggingLevel.DEV);
    discord_client.on("ready", () => {
        log(`Started classicdb_bot in ${config.deployment_mode} mode`);
    });

    // On message recieved behavior.
    discord_client.on("message", async (message) => {
        const author = `${message.author.username}@${message.author.id}`;
        const channel_identity = get_channel_identity(message.channel, author);

        // Replace code markdown content.
        message.content = message.content.replace(/`{1}[^`]+`{1}/g, "");
        message.content = message.content.replace(/`{3}[^`]+`{3}/g, "");

        await DatabaseHandler.register_guild(channel_identity.guild_id);
        if (message.content.startsWith(`<@!${discord_client.user.id}>`)) {
            const command = message.content.split(" ")[1];
            if (command) {
                const resp = await execute(command, message, channel_identity);
                message.channel.send(resp);
                log(`User ${message.author.id} requested to execute command
                    ${command} with owner ${channel_identity.owner_id}`
                    , LoggingLevel.DEV);
                return;
            }
        }

        if (message.content.toLowerCase().includes("[26 dps]")) {
            message.channel.send(`Don't justify these peons with a response
                Tips. They're probably a bunch of trash private server gamers
                who will never amount to anything in retail classic. I bet
                they're in raiding guilds who don't bring 8 mages to every raid
                in 2019 lul. Try talking to him when your guild can do a 3 hour
                MC losers.`);
            log("Sent [26 dps] tips meme:", LoggingLevel.DEV);
            log(`\tServer:  ${channel_identity.guild_name}`, LoggingLevel.DEV);
            log(`\tChannel: ${channel_identity.name}`, LoggingLevel.DEV);
            log(`\tRequested by: ${message.author.username}`, LoggingLevel.DEV);
            return;
        }

        const gp = await DatabaseHandler.get_parser(channel_identity.guild_id);
        current_parser = gp === "classicdb"
            ? classicdb_parser
            : itemization_parser;

        if (message.content.includes("(classicdb)")) {
            current_parser = classicdb_parser;
        } else if (message.content.includes("(itemization)")) {
            current_parser = itemization_parser;
        }

        // Handle message recieved.
        const response = await current_parser.respond_to(message.content);
        if (!response) {
            return;
        }
        for (const embed_msg of response) {
            message.channel.send({embed: embed_msg}).catch(handle_exception);
        }
        log("Sent item tooltip:", LoggingLevel.DEV);
        log(`\tServer:  ${channel_identity.guild_name}`, LoggingLevel.DEV);
        log(`\tChannel: ${channel_identity.name}`, LoggingLevel.DEV);
        log(`\tRequested by: ${message.author.username}`, LoggingLevel.DEV);
    });

    // Authenticate.
    discord_client.login(dicord_token).catch((e: Error) => handle_exception(e));

})();
