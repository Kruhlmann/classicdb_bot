import { Item } from "./item";
import { IPostgresDatabaseConnection, PostgresDatabaseConnection } from "./database";

export interface IExternalItemStorage {
    store_item(item: Item): Promise<void>;
}

export class PostgreSQLExternalItemStorage implements IExternalItemStorage {
    private database_connection: IPostgresDatabaseConnection;

    public constructor(username: string, password: string, database_name: string, host = "localhost", port = 5432) {
        this.database_connection = new PostgresDatabaseConnection(username, password, database_name, host, port);
    }

    public async store_item(item: Item): Promise<void> {
        console.log(item);
    }
}
