import { InvalidEnvironmentError } from "../../../error/invalid_environment";
import { Logger } from "../../../logging/logger";

export abstract class EnvironmentValidator {
    protected abstract required_variables: string[];
    protected readonly logger: Logger<void | Promise<void>>;
    private readonly environment: string[];

    public constructor(logger: Logger<void | Promise<void>>) {
        this.environment = Object.keys(process.env);
        this.logger = logger;
    }

    public validate_environment(): void {
        for (const varname of this.required_variables) {
            this.throw_invalid_environment_error_if_variable_missing(varname);
        }
        this.logger.debug(`${this.constructor.name} validated environment`);
    }

    private throw_invalid_environment_error_if_variable_missing(varname: string) {
        if (!this.environment.includes(varname)) {
            throw new InvalidEnvironmentError(`Missing environment variable: ${varname}`);
        }
        this.logger.debug(`Found ${varname} in environment`);
    }
}
