import { Sequelize } from "sequelize";

export class PostgresDatabaseConnection {
    public static instance: PostgresDatabaseConnection;
    public database: Sequelize;

    private constructor(username: string, password: string, database_name: string, host = "localhost", port = 5432) {
        const connection_string = `postgres://${username}:${password}@${host}:${port}/${database_name}`;
        this.database = new Sequelize(connection_string, { logging: console.log });
        console.log(`Connected to database through ${connection_string}`);
    }

    public static initialize(
        username: string,
        password: string,
        database_name: string,
        host = "localhost",
        port = 5432
    ): void {
        if (!PostgresDatabaseConnection.instance) {
            PostgresDatabaseConnection.instance = new PostgresDatabaseConnection(
                username,
                password,
                database_name,
                host,
                port
            );
        }
    }
}
