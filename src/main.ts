/**
 * @fileoverview Main entry point for application.
 * @author Andreas Kruhlmann
 * @since 1.2.0
 */

import * as sentry from "@sentry/node";
import * as discord from "discord.js";

import * as config from "../config.json";

import * as db from "./db.js";
import { handle_exception, log } from "./io";
import { execute, get_channel_identity } from "./lib.js";
import { ClassicDBParser } from "./parsers/classicdb/parser.js";
import { ItemizationParser } from "./parsers/itemization/parser.js";
import { alias_meme_response,
         file_meme_response,
         item_meme_response,
         help_response,
         plaintext_meme_response,
         } from "./parsers/memes/parser.js";
import { LoggingLevel, Parser } from "./typings/types.js";

declare global {
    namespace NodeJS {
        /** Sentry global namespace for error handling.  */
        interface Global {
            __rootdir__: string;
        }
    }
}
global.__rootdir__ = __dirname || process.cwd();

process.on("uncaughtException", handle_exception);
process.on("unhandledRejection", handle_exception);

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
    await db.connect(config.database);

    // Initialize error reporting.
    sentry.init({dsn: config.sentry_dsn});

    log("Awaiting response from discord", LoggingLevel.DEV);
    discord_client.on("ready", () => {
        log(`Started classicdb_bot in ${config.deployment_mode} mode`);
    });

    // On message received behavior.
    discord_client.on("message", async (message) => {
        if (!message.guild) {
            // Ignore DMs.
            return;
        }

        const author = `${message.author.username}@${message.author.id}`;
        const channel_identity = get_channel_identity(message.channel, author);
        db.update_guild(message.guild);

        // Default guild parser;
        const gp = await db.get_parser(channel_identity.guild_id);

        // Replace code markdown content.
        message.content = message.content.replace(/`{1}[^`]+`{1}/g, "");
        message.content = message.content.replace(/`{3}[^`]+`{3}/g, "");

        await db.register_guild(message.guild);
        if (message.isMentioned(discord_client.user)) {
            const command = message.content.split(" ")[1];
            if (command) {
                const resp = await execute(command, message, message.guild);
                message.channel.send(resp);
                log(`User ${message.author.id} requested to execute command ${command} with owner ${channel_identity.owner_id}`, LoggingLevel.DEV);
                return;
            }
        }

        // Help command.
        const help_res = help_response(message, gp);
        if (help_res) {
            message.author.send(help_res);
            return;
        }

        // Meme reponses
        const meme_response_i = item_meme_response(message);
        if (meme_response_i) {
            message.channel.send(meme_response_i);
            return;
        }

        const meme_response_p = plaintext_meme_response(message);
        if (meme_response_p !== "") {
            const author_mention = `<@${message.author.id}>`;
            const m_res = meme_response_p.replace(/%USER%/g, author_mention);
            message.channel.send(m_res);
            return;
        }

        const meme_response_f = file_meme_response(message);
        if (meme_response_f) {
            message.channel.send(meme_response_f);
            return;
        }

        // Replace alias with proper item names.
        message = alias_meme_response(message);

        current_parser = gp === "classicdb"
            ? classicdb_parser
            : itemization_parser;
        // Manual parser overrides.
        if (message.content.includes("(classicdb)")) {
            current_parser = classicdb_parser;
        } else if (message.content.includes("(itemization)")) {
            current_parser = itemization_parser;
        }

        // Handle message recieved.
        const response = await current_parser.respond_to(message);
        if (!response) {
            return;
        }
        for (const embed_msg of response) {
            message.channel.send({embed: embed_msg})
                .catch(handle_exception);
        }
    });

    // Authenticate.
    discord_client.login(dicord_token)
        .catch(handle_exception);

})();
