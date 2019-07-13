/**
 * @fileoverview Handles database connection.
 * @author Andreas Kruhlmann
 * @since 1.3.0
 */

import { Guild } from "discord.js";
import * as fs from "fs";
import * as path from "path";
import * as sqlite from "sqlite";

import * as config from "../config.json";

import { handle_exception, log } from "./io";
import { LoggingLevel } from "./typings/types";

// SQLite DB object.
let db: sqlite.Database;
let connected = false;

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

    log ("Migrating database", LoggingLevel.DEV);
    const migration_options = config.deployment_mode === "development"
        ? {force: "last"}
        : {};
    log ("Database migrated succeessfully", LoggingLevel.DEV);
    await db.migrate(migration_options);
}

/**
 * Registers a successful item request from a parser. Used for statistical
 * purposes.
 *
 * @async
 * @param query - The user query
 * @param item_id - ID of found item
 * @param server_id - Discord guild ID
 * @param server_name - Discord guild name.
 * @param parser - String identifier of used parser (same format as in the
 * `guild_configs`).
 */
export async function register_query(item_id: string,
                                     server_id: string,
                                     server_name: string,
                                     parser: string): Promise<void> {
    const row = [item_id, server_id, server_name, parser];
    const sql_query = "INSERT INTO queries VALUES (?, ?, ?, ?)";
    await db.run(sql_query, row);
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
    type t = {parser: string};
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
    await db.run(q, [guild.id, parser]);
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
    const q = "SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name=?";
    type t = {["COUNT(*)"]: string};
    return db.get(q, [table_name]).then((r: t) => r["COUNT(*)"] !== "0");
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
    const q = "SELECT EXISTS(SELECT '1' FROM guild_configs WHERE id=? ) AS guild_exists";
    type t = {guild_exists: string};
    return db.get(q, [guild_id]).then((row: t) => row.guild_exists === "1");
}

/**
 * Registers a new guild in the database.
 *
 * @async
 * @param guild - Guild to register.
 */
export async function register_guild(guild: Guild): Promise<void> {
    const exists = await guild_exists(guild.id);
    if (! exists) {
        const q = "INSERT INTO guild_configs VALUES (?, 'classicdb', 0, ?)";
        await db.run(q, [guild.id, guild.iconURL]);
    }
}

/**
 * Ensures the database in the DB matches with the data from discord.
 *
 * @async
 * @param guild - Guild to update.
 */
export async function update_guild(guild: Guild): Promise<void> {
    await register_guild(guild);
    await db.run("UPDATE guild_configs SET icon=?", [guild.iconURL]);
}
