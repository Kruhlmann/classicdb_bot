/**
 * @fileoverview Handles database connection.
 * @author Andreas Kruhlmann
 * @since 1.3.0
 */

import * as fs from "fs";
import * as path from "path";
import * as sqlite from "sqlite3";
import { handle_exception, log } from "./io";
import { LoggingLevel } from "./typings/types";

export class DatabaseHandler {
    public static async connect(database_path: string) {
        const unresolved_path = `${__dirname}/../../${database_path}`;
        const resolved_path = path.resolve(unresolved_path);
        log(`Connecting to ${database_path}`, LoggingLevel.DEV);

        if (!fs.lstatSync(resolved_path).isFile) {
            throw new Error(`${resolved_path} is not a file`);
        }

        this.db = new sqlite.Database(resolved_path, (error: Error) => {
            if (error) {
                throw error;
            }
        });

        await this.create_tables();

        log(`Connected to ${database_path}`);
    }

    public static async create_tables() {
        const guild_configs_exists = await this.table_exists("guild_configs");
        if (!guild_configs_exists) {
            log("Creating guild_configs table");
            this.exe_qu(`CREATE TABLE guild_configs (
                        id TEXT NOT NULL UNIQUE,
                        parser TEXT NOT NULL,
                        memes INTEGER NOT NULL DEFAULT 0)`);
        }
    }

    public static get_parser(guild_id: string) {
        return this.get_qu(`SELECT parser
                            FROM guild_configs
                            WHERE id=?`, [guild_id]).then((row: any) => {
                                return row.parser;
                            });
    }

    public static table_exists(table_name: string) {
        return this.get_qu(`SELECT COUNT(*)
                            FROM sqlite_master
                            WHERE type='table'
                            AND name=?`, [table_name]).then((row: any) => {
                                return row["COUNT(*)"];
                            });
    }

    public static set_guild_parser(guild_id: string, parser: string) {
        log(`Changing parser to ${parser} in guild ${guild_id}`);
        return this.exe_qu(`UPDATE guild_configs
                            SET parser=?
                            WHERE id=?`, [parser, guild_id]);
    }

    public static exe_qu(sql: string, params: any[] = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, (err: Error, row: sqlite.RunResult) => {
                if (err) {
                    handle_exception(err);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    public static get_qu(sql: string, params: any[] = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    public static async register_guild(guild_id: string) {
        const exists = await this.guild_exists(guild_id);
        if (! exists) {
            this.exe_qu(`INSERT INTO
                            guild_configs
                        VALUES (?, 'classicdb', 0)`, [guild_id]).then(() => {
                            log(`Added guild ${guild_id} to the database`);
                        });
        }
    }

    public static guild_exists(guild_id: string) {
        return this.get_qu(`SELECT EXISTS(
                                SELECT 1 FROM guild_configs
                                WHERE id=?
                            ) AS guild_exists`, [guild_id]).then((row: any) => {
                                return row.guild_exists === 1;
                            });
    }

    private static db: sqlite.Database;
}
