import { ModelInitializer } from "./models";
import { PostgresDatabaseConnection } from "./database";
import { ClassicDBBot } from "./bot";

async function main(): Promise<void> {
    //PostgresDatabaseConnection.initialize("postgres", "postgres", "classicdb_bot");
    //ModelInitializer.initialize(PostgresDatabaseConnection.instance.database, true);
    //await new ClassicDBBot(".XMjfcw.ammtWVSB3_q5AhaPWWn55_7MPVk").start();
}

main();
