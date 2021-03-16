import { Sequelize } from "sequelize";

export interface IPostgresDatabaseConnection {
    database: Sequelize;
}

export class PostgresDatabaseConnection {
    public database: Sequelize;

    public constructor(username: string, password: string, database_name: string, host: string, port: number) {
        const connection_string = `postgres://${username}:${password}@${host}:${port}/${database_name}`;
        this.database = new Sequelize(connection_string, { logging: console.log });
    }
}
