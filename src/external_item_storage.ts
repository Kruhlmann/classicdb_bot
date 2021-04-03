import * as fs from "fs";

import { IPostgresDatabaseConnection, PostgresDatabaseConnection } from "./database";
import { IItem } from "./item";
import { ILoggable } from "./logging";
import { DatabaseModelBuilder } from "./models";
import { DiscordGuildModel } from "./models/discord_guild";
import { DiscordGuildConfigurationModel } from "./models/discord_guild_configuration";
import { ItemModel } from "./models/item";
import { ItemQueryModel } from "./models/item_query";
import { timeout_after } from "./timeout";

export interface IExternalItemStorage {
    lookup(key: string): Promise<IItem | void>;
    store_item(item: IItem): Promise<void>;
    initialize(): Promise<void>;
}

abstract class PostgreSQLExternalItemStorage implements IExternalItemStorage {
    protected readonly database_connection: IPostgresDatabaseConnection;
    protected readonly logger: ILoggable;
    protected readonly model_initializer: DatabaseModelBuilder;
    protected readonly models = [DiscordGuildModel, DiscordGuildConfigurationModel, ItemModel, ItemQueryModel];

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

    @timeout_after(2000)
    public async store_item(item: IItem): Promise<void> {
        this.logger.log(item.name);
    }

    public async lookup(key: string): Promise<IItem | void> {
        return ItemModel.findByPk(key).then((item?: unknown) => {
            if (item) {
                return item as IItem;
            }
        });
    }

    public abstract initialize(): Promise<void>;
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

    private read_and_parse(): Record<string, IItem> {
        return JSON.parse(this.read()) as Record<string, IItem>;
    }

    public async lookup(item_name: string): Promise<IItem | void> {
        const file_contents_object = this.read_and_parse();
        if (Object.keys(file_contents_object).includes(item_name)) {
            return file_contents_object[item_name];
        }
    }

    protected write(items: Record<string, IItem>): void {
        fs.writeFileSync(this.abs_file_path, JSON.stringify(items));
    }

    protected get abs_file_path(): string {
        return `${__dirname}/../../${this.file_path}`;
    }

    public async store_item(item: IItem): Promise<void> {
        const file_contents_object = this.read_and_parse();
        file_contents_object[item.name] = item;
        this.write(file_contents_object);
    }

    public abstract initialize(): Promise<void>;
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
