import { EnvironmentValidator } from "./validator";

export class ClassicDBBotEnvironmentValidator extends EnvironmentValidator {
    protected required_variables = [
        "CLASSICDB_BOT_TOKEN",
        "CLASSICDB_BOT_CLIENT_ID",
        "CLASSICDB_BOT_PROD",
        "CLASSICDB_BOT_DISCORD_REST_VERSION",
        "BATTLENET_CLIENT_ID",
        "BATTLENET_CLIENT_SECRET",
    ];
}
