import { ModelInitializer } from "./models";
import { PostgresDatabaseConnection } from "./database";
import { ClassicDBBot } from "./bot";
import { BlizzardAPIClient } from "./blizzard_api_client";

async function main(): Promise<void> {
    //PostgresDatabaseConnection.initialize("postgres", "postgres", "classicdb_bot");
    //ModelInitializer.initialize(PostgresDatabaseConnection.instance.database, true);
    //await new ClassicDBBot("NTcyOTMzMDEzOTYxNDQxMjgy.XMjfcw.ammtWVSB3_q5AhaPWWn55_7MPVk").start();
    const api = new BlizzardAPIClient("7eee090d5325410f8e64c976ae3103e8", "qUZmuUSitK28aSAsGUVi8SWFcORtVpmz");
    api.search_items("Thunderfury");
}

main();
