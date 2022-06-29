import { SlashCommandBuilder } from "@discordjs/builders";
import { ClassicDBBot } from "../bot/classicdb";
import { EnvironmentValidator } from "../io/environment/validators/validator";
import { Logger } from "../logging/logger";

export abstract class Main {
    protected readonly logger: Logger;
    protected readonly environment_validator: EnvironmentValidator;
    protected readonly bot: ClassicDBBot;

    public constructor(logger: Logger, environment_validator: EnvironmentValidator) {
        this.logger = logger;
        this.environment_validator = environment_validator;
        this.bot = new ClassicDBBot(
            process.env["CLASSICDB_BOT_TOKEN"],
            process.env["CLASSICDB_BOT_CLIENT_ID"],
            process.env["CLASSICDB_BOT_DISCORD_REST_VERSION"],
            this.logger,
            [new SlashCommandBuilder().setName("item").setDescription("Replies with an item")].map((command) =>
                command.toJSON(),
            ),
        );
        this.validate_environment();
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
