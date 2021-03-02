import { SQLiteDatabaseConnection } from "./database";
import * as config from "../config.json";

async function main(): Promise<void> {
    const db = new SQLiteDatabaseConnection(
        "./db/classicdb_bot.db",
        config.icon_path
    );
    await db.connect();
    db.is_guild_registered("xyz").then(console.log);
}

main();
