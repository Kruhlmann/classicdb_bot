import { IPostgresDatabaseConnection, PostgresDatabaseConnection } from "./database";
import { Item } from "./item";
import { ILoggable } from "./logging";
import { DatabaseModelBuilder } from "./models";
import { DiscordGuild } from "./models/discord_guild";

export interface IExternalItemStorage {
    store_item(item: Item): Promise<void>;
    initialize(): Promise<void>;
}

export class PostgreSQLExternalItemStorage implements IExternalItemStorage {
    private readonly database_connection: IPostgresDatabaseConnection;
    private readonly logger: ILoggable;
    private readonly model_initializer: DatabaseModelBuilder;

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

    public async initialize(): Promise<void> {
        this.model_initializer.initialize([DiscordGuild], true);
    }

    public async store_item(item: Item): Promise<void> {
        this.logger.log(JSON.stringify(item));
    }
}
