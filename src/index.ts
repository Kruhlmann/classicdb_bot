import { ModelInitializer } from "./models";
import { PostgresDatabaseConnection } from "./database";
import { ClassicDBBot } from "./bot";

async function main(): Promise<void> {
    const bot = new ClassicDBBot(process.env["CLASSICDB_BOT_TOKEN"]);
    await bot.start();
}

main();
