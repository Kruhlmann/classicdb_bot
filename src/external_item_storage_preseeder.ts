import { ILoggable } from "./logging";
import { ItemBindingModel } from "./models/binding";
import { ExpansionModel } from "./models/expansion";

export interface IExternalItemStoragePreseeder {
    preseed(): Promise<void>;
}

export class PostgreSQLExternalItemStoragePreseeder implements IExternalItemStoragePreseeder {
    private logger: ILoggable;

    public constructor(logger: ILoggable) {
        this.logger = logger;
    }

    private async create_expansion_if_missing(expansion_name: string): Promise<void> {
        const expansion = await ExpansionModel.findOne({ where: { string_identifier: expansion_name } });
        if (!expansion) {
            await ExpansionModel.create({ string_identifier: expansion_name })
                .catch((error) => {
                    throw error;
                })
                .then();
            this.logger.log(`Created missing expansion: "${expansion_name}"`);
        }
    }

    private async create_binding_type_if_missing(binding_name: string): Promise<void> {
        const binding = await ItemBindingModel.findOne({ where: { type: binding_name } });
        if (!binding) {
            await ItemBindingModel.create({ type: binding_name })
                .catch((error) => {
                    throw error;
                })
                .then();
            this.logger.log(`Created missing binding type: "${binding_name}"`);
        }
    }

    public async preseed(): Promise<void> {
        await Promise.all([
            this.create_expansion_if_missing("classic"),
            this.create_expansion_if_missing("tbc"),
            this.create_expansion_if_missing("wotlk"),
            this.create_expansion_if_missing("cata"),
            this.create_expansion_if_missing("mop"),
            this.create_expansion_if_missing("wod"),
            this.create_expansion_if_missing("legion"),
            this.create_expansion_if_missing("bfa"),
            this.create_binding_type_if_missing("pickup"),
            this.create_binding_type_if_missing("equip"),
        ]).catch((error) => {
            throw error;
        });
        this.logger.debug("Pre-seeded database");
    }
}
