import { ClassicDBBotEnvironmentValidator } from "./io/environment/validators/classicdb_bot";
import { EnvironmentValidator } from "./io/environment/validators/validator";
import { Logger } from "./logging/logger";
import { STDOutputLogger } from "./logging/loggers/stdout";
import { ISODatePreformatter } from "./logging/preformatter/iso_date";
import { DevelopmentMain } from "./main/dev";

const logger: Logger = new STDOutputLogger(new ISODatePreformatter());
const environment_validator: EnvironmentValidator = new ClassicDBBotEnvironmentValidator(logger);
new DevelopmentMain(logger, environment_validator).main();
