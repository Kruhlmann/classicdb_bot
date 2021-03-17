import { ClassicDBBot } from "./bot";
import { PostgresDatabaseConnection } from "./database";
import { PostgreSQLExternalItemStorage } from "./external_item_storage";
import { ModelInitializer } from "./models";

async function main(): Promise<void> {
    const item_storage = new PostgreSQLExternalItemStorage("postgres", "postgres", "classicdb");
    const bot = new ClassicDBBot(process.env["CLASSICDB_BOT_TOKEN"], item_storage);
    await bot.start();
}

main();
