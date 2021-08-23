import { version } from "../package.json";
import { ClassicDBBot, IClassicDBBot } from "./bot";
import { ClassicDBBotProductionEnvironmentValidator, ClassicDBBotDevelopmentEnvironmentValidator, IEnvironmentValidator } from "./environment_validator";
import {
    IExternalItemStorage,
    PersistentPostgreSQLExternalItemStorage,
    TemporalPostgreSQLExternalItemStorage,
} from "./external_item_storage";
import {
    IExternalItemStoragePreseeder,
    PostgreSQLExternalItemStoragePreseeder,
} from "./external_item_storage_preseeder";
import { ILoggable, ISODatePreformatter, SynchronousFileOutputLogger } from "./logging";

abstract class Main {
    protected readonly logger: ILoggable;
    protected readonly environment_validator: IEnvironmentValidator;
    protected readonly external_item_storage: IExternalItemStorage;
    protected readonly external_item_storage_preseeder: IExternalItemStoragePreseeder;
    protected readonly bot: IClassicDBBot;

    public constructor(
        logger: ILoggable,
        external_item_storage_preseeder: IExternalItemStoragePreseeder,
        environment_validator: IEnvironmentValidator,
    ) {
        this.logger = logger;
        this.external_item_storage_preseeder = external_item_storage_preseeder;
        this.environment_validator = environment_validator;
        this.validate_environment();
        this.external_item_storage= this.create_external_item_storage();
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

    protected abstract create_external_item_storage(): IExternalItemStorage;

    public abstract main(): Promise<void>;
}

class ProductionMain extends Main {
    public constructor() {
        const preformatter = new ISODatePreformatter();
        const logger = new SynchronousFileOutputLogger("/dev/stdout", preformatter, true);
        const environment_validator = new ClassicDBBotProductionEnvironmentValidator(logger);
        const external_item_storage_preseeder = new PostgreSQLExternalItemStoragePreseeder(logger);
        super(logger, external_item_storage_preseeder, environment_validator);
    }

    protected create_external_item_storage(): IExternalItemStorage {
        return new PersistentPostgreSQLExternalItemStorage(
            this.logger,
            process.env["POSTGRES_USER"],
            process.env["POSTGRES_PASSWORD"],
            process.env["POSTGRES_DB"],
            process.env["DB_HOST"],
        )
    }

    public async main() {
        this.logger.log(`Starting classicdb bot v${version} in production mode`);
        await this.external_item_storage.initialize();
        await this.external_item_storage_preseeder.preseed();
        await this.bot.start();
    }
}

class DevelopmentMain extends Main {
    public constructor() {
        const preformatter = new ISODatePreformatter();
        const logger = new SynchronousFileOutputLogger("/dev/stdout", preformatter, true);
        const environment_validator = new ClassicDBBotDevelopmentEnvironmentValidator(logger);
        const external_item_storage_preseeder = new PostgreSQLExternalItemStoragePreseeder(logger);
        super(logger, external_item_storage_preseeder, environment_validator);
    }

    protected create_external_item_storage(): IExternalItemStorage {
        return new TemporalPostgreSQLExternalItemStorage(
            this.logger,
            "postgres",
            "postgres",
            "classicdb_bot_dev",
        );
    }

    public async main() {
        this.logger.log(`Starting classicdb bot v${version} in development mode`);
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
