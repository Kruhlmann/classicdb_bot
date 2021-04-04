import { version } from "../package.json";
import { ClassicDBBotArgumentParser } from "./argparser";
import { ClassicDBBot, IClassicDBBot } from "./bot";
import { ClassicDBBotEnvironmentValidator, IEnvironmentValidator } from "./environment_validator";
import {
    IExternalItemStorage,
    PersistentPostgreSQLExternalItemStorage,
    TemporalPostgreSQLExternalItemStorage,
} from "./external_item_storage";
import {
    IExternalItemStoragePreseeder,
    PostgreSQLExternalItemStoragePreseeder,
} from "./external_item_storage_preseeder";
import { IGlobalErrorReporter } from "./global_error_reporter";
import { ILoggable, ISODatePreformatter, SynchronousFileOutputLogger } from "./logging";

abstract class Main {
    protected readonly logger: ILoggable;
    protected readonly environment_validator: IEnvironmentValidator;
    protected readonly external_item_storage: IExternalItemStorage;
    protected readonly external_item_storage_preseeder: IExternalItemStoragePreseeder;
    protected readonly bot: IClassicDBBot;

    public constructor(
        logger: ILoggable,
        external_item_storage: IExternalItemStorage,
        external_item_storage_preseeder: IExternalItemStoragePreseeder,
    ) {
        this.logger = logger;
        this.environment_validator = new ClassicDBBotEnvironmentValidator();
        this.external_item_storage = external_item_storage;
        this.external_item_storage_preseeder = external_item_storage_preseeder;
        this.bot = new ClassicDBBot(process.env["CLASSICDB_BOT_TOKEN"], this.logger, this.external_item_storage);
    }

    protected validate_environment() {
        try {
            this.environment_validator.validate_environment();
        } catch (error) {
            this.logger.error(error);
            process.exit(1);
        }
    }

    public abstract main(): Promise<void>;
}

class ProductionMain extends Main {
    private readonly error_reporter: IGlobalErrorReporter;

    public constructor() {
        const log_path = new ClassicDBBotArgumentParser().parse().log_file;
        const preformatter = new ISODatePreformatter();
        const logger = new SynchronousFileOutputLogger(log_path, preformatter, false);
        const external_item_storage_preseeder = new PostgreSQLExternalItemStoragePreseeder(logger);
        const external_item_storage = new PersistentPostgreSQLExternalItemStorage(
            logger,
            "postgres",
            "postgres",
            "classicdb_bot_prod",
        );
        super(logger, external_item_storage, external_item_storage_preseeder);
    }

    public async main() {
        this.logger.log(`Starting classicdb bot v${version} in production mode`);
        this.validate_environment();
        this.error_reporter.initialize();
        await this.external_item_storage.initialize();
        await this.external_item_storage_preseeder.preseed();
        await this.bot.start();
    }
}

class DevelopmentMain extends Main {
    public constructor() {
        const log_path = new ClassicDBBotArgumentParser().parse().log_file;
        const preformatter = new ISODatePreformatter();
        const logger = new SynchronousFileOutputLogger(log_path, preformatter, true);
        const external_item_storage_preseeder = new PostgreSQLExternalItemStoragePreseeder(logger);
        const external_item_storage = new TemporalPostgreSQLExternalItemStorage(
            logger,
            "postgres",
            "postgres",
            "classicdb_bot_dev",
        );
        super(logger, external_item_storage, external_item_storage_preseeder);
    }

    public async main() {
        this.logger.log(`Starting classicdb bot v${version} in development mode`);
        this.validate_environment();
        this.environment_validator.validate_environment();
        await this.external_item_storage.initialize();
        await this.external_item_storage_preseeder.preseed();
        await this.bot.start();
    }
}

if (process.env["CLASSICDB_PROD"] === "1") {
    new ProductionMain().main();
} else {
    new DevelopmentMain().main();
}
