import { InvalidEnvironmentError } from "./exceptions";

export interface IEnvironmentValidator {
    validate_environment(): void;
}

abstract class EnvironmentValidator {
    protected abstract required_variables: string[];
    private readonly environment: string[];

    public constructor() {
        this.environment = Object.keys(process.env);
    }

    public validate_environment(): void {
        for (const varname of this.required_variables) {
            this.throw_invalid_environment_error_if_variable_missing(varname);
        }
    }

    private throw_invalid_environment_error_if_variable_missing(varname: string) {
        if (!this.environment.includes(varname)) {
            throw new InvalidEnvironmentError(`Missing environment variable: ${varname}`);
        }
    }
}

export class ClassicDBBotEnvironmentValidator extends EnvironmentValidator {
    protected required_variables = ["CLASSICDB_BOT_TOKEN"];
}
