import { version } from "../package.json";
import { ClassicDBBotArgumentParser } from "./argparser";
import { ClassicDBBot, IClassicDBBot } from "./bot";
import { IExternalItemStorage, PostgreSQLExternalItemStorage } from "./external_item_storage";
import { ILoggable, ISODatePreformatter, SynchronousFileOutputLogger } from "./logging";

class Main {
    private readonly bot: IClassicDBBot;
    private readonly external_item_storage: IExternalItemStorage;
    private readonly logger: ILoggable;

    public constructor() {
        const log_path = new ClassicDBBotArgumentParser().parse().log_file;
        const preformatter = new ISODatePreformatter();
        this.logger = new SynchronousFileOutputLogger(log_path, preformatter);
        this.external_item_storage = new PostgreSQLExternalItemStorage(
            this.logger,
            "postgres",
            "postgres",
            "classicdb_bot_dev",
        );
        this.bot = new ClassicDBBot(process.env["CLASSICDB_BOT_TOKEN"], this.logger, this.external_item_storage);
    }

    public async main(): Promise<void> {
        this.logger.log(`Starting classicdb bot v${version}`);
        await this.external_item_storage.initialize();
        await this.bot.start();
    }
}

new Main().main();
