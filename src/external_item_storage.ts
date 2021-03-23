import * as fs from "fs";

import { IPostgresDatabaseConnection, PostgresDatabaseConnection } from "./database";
import { IItem } from "./item";
import { ILoggable } from "./logging";
import { DatabaseModelBuilder } from "./models";
import { DiscordGuildModel } from "./models/discord_guild";
import { ItemModel } from "./models/item";
import { ItemQueryModel } from "./models/item_query";

export interface IExternalItemStorage {
    store_item(item: IItem): Promise<void>;
    initialize(): Promise<void>;
}

abstract class PostgreSQLExternalItemStorage implements IExternalItemStorage {
    protected readonly database_connection: IPostgresDatabaseConnection;
    protected readonly logger: ILoggable;
    protected readonly model_initializer: DatabaseModelBuilder;
    protected readonly models = [DiscordGuildModel, ItemModel, ItemQueryModel];

    public constructor(
        logger: ILoggable,
        username: string,
        password: string,
        database_name: string,
        host = "localhost",
        port = 5432,
    ) {
        this.database_connection = new PostgresDatabaseConnection(username, password, database_name, host, port);
        this.model_initializer = new DatabaseModelBuilder(this.database_connection.database, logger);
        this.logger = logger;
    }

    public async store_item(item: IItem): Promise<void> {
        this.logger.log(item.name);
    }

    public abstract async initialize(): Promise<void>;
}

export class TemporalPostgreSQLExternalItemStorage extends PostgreSQLExternalItemStorage {
    public async initialize(): Promise<void> {
        this.model_initializer.initialize(this.models, true);
    }
}

export class PersistentPostgreSQLExternalItemStorage extends PostgreSQLExternalItemStorage {
    public async initialize(): Promise<void> {
        this.model_initializer.initialize(this.models, false);
    }
}

abstract class JSONExternalItemStorage implements IExternalItemStorage {
    private readonly file_path: string;

    public constructor(file_path: string) {
        this.file_path = file_path;
    }

    private read(): string {
        return fs.readFileSync(this.abs_file_path).toString();
    }

    protected write(items: Record<string, IItem>): void {
        fs.writeFileSync(this.abs_file_path, JSON.stringify(items));
    }

    protected get abs_file_path(): string {
        return `${__dirname}/${this.file_path}`;
    }

    public async store_item(item: IItem): Promise<void> {
        const file_contents_object: Record<string, IItem> = JSON.parse(this.read());
        file_contents_object[item.name] = item;
        this.write(file_contents_object);
    }

    public abstract async initialize(): Promise<void>;
}

export class TemporalJSONExternalItemStorage extends JSONExternalItemStorage {
    public async initialize(): Promise<void> {
        this.write({});
    }
}

export class PermanentJSONExternalItemStorage extends JSONExternalItemStorage {
    public async initialize(): Promise<void> {
        if (!fs.existsSync(this.abs_file_path)) {
            this.write({});
        }
    }
}
