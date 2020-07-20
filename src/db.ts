/**
 * @fileoverview Handles database connection.
 * @author Andreas Kruhlmann
 * @since 1.3.0
 */

import { Guild } from "discord.js";
import * as fs from "fs";
import * as path from "path";
import * as request from "request-promise";
import * as sqlite from "sqlite";

import * as config from "../config.json";

import { log } from "./io";
import { LoggingLevel } from "./typings/types";

// SQLite DB object.
export let db: sqlite.Database;
export let connected = false;

/**
 * Opens a connection to the database file.
 *
 * @async
 * @param database_path - Path to database file.
 */
export async function connect(database_path: string): Promise<void> {
    if (connected) {
        return;
    }

    log(`Connecting to ${database_path}`, LoggingLevel.DEV);

    const unresolved_path = `${__dirname}/../../${database_path}`;
    const resolved_path = path.resolve(unresolved_path);

    if (!fs.lstatSync(resolved_path).isFile) {
        throw new Error(`${resolved_path} is not a file`);
    }

    db = await sqlite.open(resolved_path);
    connected = true;
    log(`Connected to ${database_path}`);

    log("Migrating database", LoggingLevel.DEV);
    const migration_options =
        config.deployment_mode === "development" ? { force: "last" } : {};
    await db.migrate(migration_options);
    log("Database migrated succeessfully", LoggingLevel.DEV);
}

/**
 * Registers a successful item request from a parser. Used for statistical
 * purposes.
 *
 * @async
 * @param item_id - ID of found item
 * @param server_id - Discord guild ID
 * @param parser - String identifier of used parser (same format as in the
 * `guild_configs`).
 */
export async function register_query(
    item_id: string,
    server_id: string,
    parser: string
): Promise<void> {
    const exists_q =
        "SELECT EXISTS(SELECT 1 FROM queries WHERE server_id=? AND item_id=?) AS exi";
    type t = { exi: number };
    const exists = await db
        .get(exists_q, [server_id, item_id])
        .then((r: t) => r.exi);

    if (exists) {
        const q =
            "UPDATE queries SET hits = hits + 1 WHERE server_id=? AND item_id=?";
        await db.run(q, [server_id, item_id]);
    } else {
        const q = "INSERT INTO queries VALUES (?, ?, ?, 1)";
        await db.run(q, [item_id, server_id, parser]);
    }
}

/**
 * Returns the parser for a given guild.
 *
 * @async
 * @param guild_id - Guild ID.
 * @returns - String identifier of guild parser.
 */
export async function get_parser(guild_id: string): Promise<string> {
    const q = "SELECT parser FROM guild_configs WHERE id=?";
    type t = { parser: string };
    return db.get(q, [guild_id]).then((r: t) => r.parser);
}

/**
 * Modifies the parser for a specific guild.
 *
 * @async
 * @param guild - Guild to apply changes to.
 * @param parser - New parser string identifier.
 */
export async function set_parser(guild: Guild, parser: string): Promise<void> {
    log(`Changing parser to ${parser} for guild ${guild.name}`);
    const q = "UPDATE guild_configs SET parser=? WHERE id=?";
    await db.run(q, [parser, guild.id]);
}

export async function toggle_memes(guild: Guild): Promise<boolean> {
    log(`Toggling memes for ${guild.name}`);
    const get_query = "SELECT memes FROM guild_configs WHERE id=?";
    const current_status = await db.get(get_query, [guild.id]).then((row) => {
        return row.memes === 1;
    });
    const set_query = "UPDATE guild_configs set MEMES=? WHERE id=?";
    const new_status = current_status ? 0 : 1;
    await db.run(set_query, [new_status, guild.id]);
    return new_status === 1;
}

/**
 * Returns the existance of a table given a table name.
 *
 * @async
 * @param table_name - Table name.
 * @returns - True if table exists.
 */
export async function table_exists(table_name: string): Promise<boolean> {
    // tslint:disable-next-line: max-line-length
    const q =
        "SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name=?";
    type t = { ["COUNT(*)"]: number };
    return db.get(q, [table_name]).then((r: t) => r["COUNT(*)"] !== 0);
}

/**
 * Returns the existance of a guild in the guild_configs table.
 *
 * @async
 * @param guild_id - ID of guild.
 * @returns - True if guild exists.
 */
export async function guild_exists(guild_id: string): Promise<boolean> {
    // tslint:disable-next-line: max-line-length
    const q = "SELECT EXISTS(SELECT '1' FROM guild_configs WHERE id=? ) AS exi";
    type t = { exi: number };
    return db.get(q, [guild_id]).then((row: t) => row.exi === 1);
}

/**
 * Registers a new guild in the database.
 *
 * @async
 * @param guild - Guild to register.
 */
export async function register_guild(guild: Guild): Promise<void> {
    const icon = guild.iconURL ? path.basename(guild.iconURL) : "";
    const exists = await guild_exists(guild.id);
    if (!exists) {
        const q = "INSERT INTO guild_configs VALUES (?, 'classicdb', 0, ?, ?)";
        await db.run(q, [guild.id, icon, guild.name]);
    }
}

/**
 * Ensures the database in the DB matches with the data from discord.
 *
 * @async
 * @param guild - Guild to update.
 */
export async function update_guild(guild: Guild): Promise<void> {
    const icon = guild.iconURL ? path.basename(guild.iconURL) : "";
    update_guild_icon(guild);
    await register_guild(guild);
    await db.run("UPDATE guild_configs SET icon=?, name=? WHERE id=?", [
        icon,
        guild.name,
        guild.id,
    ]);
}

/**
 * Fetches the icon for a guild and stores it locally.
 *
 * @param guild - Guild from which to fetch the icon from.
 */
export function update_guild_icon(guild: Guild): void {
    if (!guild.iconURL) {
        return;
    }
    const rel_path = `${config.icon_path}/${path.basename(guild.iconURL)}`;
    const icon_path = path.resolve(__dirname, rel_path);
    if (!fs.existsSync(icon_path)) {
        request(guild.iconURL).pipe(fs.createWriteStream(icon_path));
        log(`Downloaded new icon for ${guild.name}`, LoggingLevel.DEV);
    }
}
