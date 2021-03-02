import * as fs from "fs";
import * as path from "path";
import * as sqlite from "sqlite";
import * as request from "request-promise";
import { log_function_call } from "./decorators";
import { Guild as DiscordServerGuild } from "discord.js";

function requires_table(name_of_table_required: string) {
    return (
        _: Object,
        method_name: string,
        descriptor: PropertyDescriptor
    ): PropertyDescriptor => {
        const original_method_called = descriptor.value;

        descriptor.value = async function (...args: unknown[]) {
            const table_exists = await (this as SQLiteDatabaseConnection).table_exists(
                name_of_table_required
            );
            if (table_exists) {
                const result = original_method_called.apply(this, args);
                return result;
            } else {
                throw new Error(
                    `Method ${method_name} is missing table ${name_of_table_required}`
                );
            }
        };

        return descriptor;
    };
}

function requires_connection(
    _: Object,
    method_name: string,
    descriptor: PropertyDescriptor
): PropertyDescriptor {
    const original_method_called = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
        const is_connected = (this as SQLiteDatabaseConnection).is_connection_established();
        if (is_connected) {
            const result = original_method_called.apply(this, args);
            return result;
        } else {
            throw new Error(
                `Method ${method_name} requires a database connection`
            );
        }
    };

    return descriptor;
}

export class SQLiteDatabaseConnection {
    public connection_is_established: boolean;
    public icon_store_path: string;
    private database_path: string;
    private database: sqlite.Database;
    private migration_options?: { force?: string };

    public constructor(
        database_path: string,
        icon_store_path: string,
        migration_options = {}
    ) {
        this.ensure_database_file_exists(path.resolve(database_path));
        this.database_path = path.resolve(database_path);
        this.migration_options = migration_options;
        this.connection_is_established = false;
    }

    private ensure_database_file_exists(path: string): void {
        const file_exists = fs.lstatSync(path).isFile;
        if (!file_exists) {
            throw new Error(`Database file "${path}" is not a file`);
        }
    }

    public is_connection_established(): boolean {
        return this.connection_is_established;
    }

    @log_function_call
    public async connect(): Promise<void> {
        if (this.connection_is_established) {
            return;
        }
        this.database = await sqlite.open(this.database_path);
        await this.database.migrate(this.migration_options);
        this.connection_is_established = true;
    }

    @requires_connection
    public async table_exists(name_of_table: string): Promise<boolean> {
        const query =
            "SELECT COUNT(*) as number_of_tables FROM sqlite_master WHERE type='table' AND name=?";
        const result = await this.database.get(query, [name_of_table]);
        return result["number_of_tables"] > 0;
    }

    @requires_connection
    @requires_table("guild_configs")
    public async is_guild_registered(guild_id: string): Promise<boolean> {
        const query =
            "SELECT EXISTS(SELECT '1' FROM guild_configs WHERE id=? ) AS guild_exists";
        const result = await this.database.get(query, [guild_id]);
        return result.guild_exists === 1;
    }

    @requires_connection
    @requires_table("guild_configs")
    public async register_guild(guild: DiscordServerGuild): Promise<void> {
        const guild_exists = await this.is_guild_registered(guild.id);
        if (guild_exists) {
            return;
        }

        const icon = guild.iconURL ? path.basename(guild.iconURL) : "";
        const query =
            "INSERT INTO guild_configs VALUES (?, 'classicdb', 0, ?, ?)";
        await this.database.run(query, [guild.id, icon, guild.name]);
    }

    @requires_connection
    @requires_table("guild_configs")
    public async update_guild(guild: DiscordServerGuild): Promise<void> {
        const icon = guild.iconURL ? path.basename(guild.iconURL) : "";
        this.update_guild_icon(guild);
        await this.register_guild(guild);
        await this.database.run(
            "UPDATE guild_configs SET icon=?, name=? WHERE id=?",
            [icon, guild.name, guild.id]
        );
    }

    @log_function_call
    @requires_connection
    @requires_table("guild_configs")
    public async update_guild_icon(guild: DiscordServerGuild): Promise<void> {
        if (!guild.iconURL) {
            return;
        }
        const rel_path = `${this.icon_store_path}/${path.basename(
            guild.iconURL
        )}`;
        const icon_path = path.resolve(__dirname, rel_path);
        if (!fs.existsSync(icon_path)) {
            request(guild.iconURL).pipe(fs.createWriteStream(icon_path));
        }
    }
}
