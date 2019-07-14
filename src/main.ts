/**
 * @fileoverview Main entry point for application.
 * @author Andreas Kruhlmann
 * @since 1.2.0
 */

import * as sentry from "@sentry/node";
import * as discord from "discord.js";

import * as config from "../config.json";

import { discord_href, discord_icon, favicon_path } from "./consts.js";
import * as db from "./db.js";
import { handle_exception, log } from "./io";
import { execute, get_channel_identity } from "./lib.js";
import { ClassicDBParser } from "./parsers/classicdb/parser.js";
import { ItemizationParser } from "./parsers/itemization/parser.js";
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
        const author = `${message.author.username}@${message.author.id}`;
        const channel_identity = get_channel_identity(message.channel, author);
        db.update_guild(message.guild);

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

        if (message.content.toLowerCase().includes("[26 dps]")) {
            message.channel.send("Don't justify these peons with a response Tips. They're probably a bunch of trash private server gamers who will never amount to anything in retail classic. I bet they're in raiding guilds who don't bring 8 mages to every raid in 2019 lul. Try talking to him when your guild can do a 3 hour MC losers.");
            log("Sent [26 dps] tips meme:", LoggingLevel.DEV);
            log(`\tServer:  ${channel_identity.guild_name}`, LoggingLevel.DEV);
            log(`\tChannel: ${channel_identity.name}`, LoggingLevel.DEV);
            log(`\tRequested by: ${message.author.username}`, LoggingLevel.DEV);
            return;
        }

        if (message.content.toLowerCase().includes("[sunderfury]")) {
            const sunderfury_message = new discord.RichEmbed()
                .setColor(0xFF8000)
                .setTitle("Sunderfury, Blessed Geberator of the Haste Shill")
                .setDescription(`Binds when picked up
One-handed Sword
Unique
**Speed Fat**
**44 - 115 Damage**
**+16 - 30 Nature Damage**
**(53.9 damage per second)**
+5 Virtginity
+25% Threat geberated
+9 Female Resistance
Durability 125/125
Requires Fury-Defiance specialization
**Chance on hit: Blast your enemies with a fat weapon increasing the SPM of the wielder. Each jump provides 1 point in unleashed rush, stacking up to five times.**
**Equip: Do 20 cleaves in one MC.**`)
                .setAuthor("Classic DB Bot (itemization.info)",
                           favicon_path,
                           discord_href)
                .setThumbnail("https://itemization.info/icons/inv_sword_39.png")
                .setFooter("https://discord.gg/mRUEPnp", discord_icon)
                .setURL("https://itemization.info/item/19019");
            message.channel.send(sunderfury_message);
            log("Sent sunderfury meme:", LoggingLevel.DEV);
            log(`\tServer:  ${channel_identity.guild_name}`, LoggingLevel.DEV);
            log(`\tChannel: ${channel_identity.name}`, LoggingLevel.DEV);
            log(`\tRequested by: ${message.author.username}`, LoggingLevel.DEV);
            return;
        }

        if (message.content.toLowerCase().includes("[unsubdued big wepan]")) {
            const unsubdued_wepan = new discord.RichEmbed()
                .setColor(0xA335EE)
                .setTitle("The Unsubdued Big wEpan")
                .setDescription(`Binds when picked up
Two-handed Sowrd (alliance bis btw)
**Spead 3.22**
**192 - 289 = DamAges**
**(70.7 big damages per hour)**
-22 IQ
+16 Thonking
Durability 120/120
Requires Autism Level Oliver
**Chance on hit: Geberates 300 Damages for every Stronk Slam used.**`)
                .setAuthor("Classic DB Bot (itemization.info)",
                           favicon_path,
                           discord_href)
                .setThumbnail("https://itemization.info/icons/inv_sword_50.png")
                .setFooter("https://discord.gg/mRUEPnp", discord_icon)
                .setURL("https://itemization.info/item/19334");
            message.channel.send(unsubdued_wepan);
            log("Sent big wepan meme:", LoggingLevel.DEV);
            log(`\tServer:  ${channel_identity.guild_name}`, LoggingLevel.DEV);
            log(`\tChannel: ${channel_identity.name}`, LoggingLevel.DEV);
            log(`\tRequested by: ${message.author.username}`, LoggingLevel.DEV);
            return;
        }

        const gp = await db.get_parser(channel_identity.guild_id);
        current_parser = gp === "classicdb"
            ? classicdb_parser
            : itemization_parser;

        if (message.content.toLowerCase().includes("[nekrage]")) {
            message.content = "[Alex's Ring of Audacity]";
            current_parser = classicdb_parser;
        }

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
        log("Sent item tooltip:", LoggingLevel.DEV);
        log(`\tServer:  ${channel_identity.guild_name}`, LoggingLevel.DEV);
        log(`\tChannel: ${channel_identity.name}`, LoggingLevel.DEV);
        log(`\tRequested by: ${message.author.username}`, LoggingLevel.DEV);
    });

    // Authenticate.
    discord_client.login(dicord_token)
        .catch(handle_exception);

})();
