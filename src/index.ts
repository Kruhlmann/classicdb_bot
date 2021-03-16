import { ModelInitializer } from "./models";
import { PostgresDatabaseConnection } from "./database";
import { ClassicDBBot } from "./bot";
import { PostgreSQLExternalItemStorage } from "./external_item_storage";

async function main(): Promise<void> {
    const item_storage = new PostgreSQLExternalItemStorage("postgres", "postgres", "classicdb");
    const bot = new ClassicDBBot(process.env["CLASSICDB_BOT_TOKEN"], item_storage);
    await bot.start();
}

main();
