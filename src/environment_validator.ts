import { InvalidEnvironmentError } from "./exceptions";
import { ILoggable } from "./logging";

export interface IEnvironmentValidator {
    validate_environment(): void;
}

abstract class EnvironmentValidator {
    protected abstract required_variables: string[];
    protected readonly logger: ILoggable;
    private readonly environment: string[];

    public constructor(logger: ILoggable) {
        this.environment = Object.keys(process.env);
        this.logger = logger;
    }

    public validate_environment(): void {
        for (const varname of this.required_variables) {
            this.throw_invalid_environment_error_if_variable_missing(varname);
        }
        this.logger.debug(`${this.constructor.name} validated environment`)
    }

    private throw_invalid_environment_error_if_variable_missing(varname: string) {
        if (!this.environment.includes(varname)) {
            throw new InvalidEnvironmentError(`Missing environment variable: ${varname}`);
        }
        this.logger.debug(`Found ${varname} in environment`);
    }
}

export class ClassicDBBotProductionEnvironmentValidator extends EnvironmentValidator {
    protected required_variables = ["CLASSICDB_BOT_TOKEN", "CLASSICDB_PROD", "POSTGRES_USER", "POSTGRES_PASSWORD", "POSTGRES_DB", "DB_HOST"];
}

export class ClassicDBBotDevelopmentEnvironmentValidator extends EnvironmentValidator {
    protected required_variables = ["CLASSICDB_BOT_TOKEN", "CLASSICDB_PROD"];
}
