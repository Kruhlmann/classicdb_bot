import { version } from "../package.json";
import { ClassicDBBotArgumentParser } from "./argparser";
import { ClassicDBBot, IClassicDBBot } from "./bot";
import {
    IExternalItemStorage,
    PersistentPostgreSQLExternalItemStorage,
    TemporalPostgreSQLExternalItemStorage,
    TemporalJSONExternalItemStorage,
} from "./external_item_storage";
import { IGlobalErrorReporter, SentryGlobalErrorReporter } from "./global_error_reporter";
import { ILoggable, ISODatePreformatter, SynchronousFileOutputLogger } from "./logging";
import { DiscordGuildModel } from "./models/discord_guild";

abstract class Main {
    protected readonly bot: IClassicDBBot;
    protected readonly external_item_storage: IExternalItemStorage;
    protected readonly logger: ILoggable;

    public constructor(logger: ILoggable, external_item_storage: IExternalItemStorage) {
        this.logger = logger;
        this.external_item_storage = external_item_storage;
        this.bot = new ClassicDBBot(process.env["CLASSICDB_BOT_TOKEN"], this.logger, this.external_item_storage);
    }

    public abstract async main(): Promise<void>;
}

class ProductionMain extends Main {
    private readonly error_reporter: IGlobalErrorReporter;

    public constructor() {
        const log_path = new ClassicDBBotArgumentParser().parse().log_file;
        const preformatter = new ISODatePreformatter();
        const logger = new SynchronousFileOutputLogger(log_path, preformatter, false);
        const external_item_storage = new PersistentPostgreSQLExternalItemStorage(
            logger,
            "postgres",
            "postgres",
            "classicdb_bot_prod",
        );
        super(logger, external_item_storage);
    }

    public async main() {
        this.logger.log(`Starting classicdb bot v${version} in production mode`);
        this.error_reporter.initialize();
        await this.external_item_storage.initialize();
        await this.bot.start();
    }
}

class DevelopmentMain extends Main {
    private readonly error_reporter: IGlobalErrorReporter;

    public constructor() {
        const log_path = new ClassicDBBotArgumentParser().parse().log_file;
        const preformatter = new ISODatePreformatter();
        const logger = new SynchronousFileOutputLogger(log_path, preformatter, true);
        //const external_item_storage = new TemporalPostgreSQLExternalItemStorage(
        //logger,
        //"postgres",
        //"postgres",
        //"classicdb_bot_dev",
        //);
        const external_item_storage = new TemporalJSONExternalItemStorage("items.json");
        super(logger, external_item_storage);
        this.error_reporter = new SentryGlobalErrorReporter(process.env["SENTRY_DNS"], 1);
    }

    public async main() {
        this.logger.log(`Starting classicdb bot v${version} in development mode`);
        this.error_reporter.initialize();
        await this.external_item_storage.initialize();
        await this.bot.start();
    }
}

if (process.env["CLASSICDB_DEV_PROD"] === "1") {
    new ProductionMain().main();
} else {
    new DevelopmentMain().main();
}
