import { Sequelize } from "sequelize";

import { ClassicDBDiscordServer } from "./discord_server";
import { ClassicDBDiscordServerConfiguration } from "./discord_server_configuration";
import { ClassicDBDiscordServerUser } from "./discord_user";
import { ClassicDBExpansion } from "./expansion";
import { ClassicDBItem } from "./item";
import { ClassicDBItemQuery } from "./item_query";

export class ModelInitializer {
    private static readonly models = [
        ClassicDBDiscordServer,
        ClassicDBExpansion,
        ClassicDBDiscordServerConfiguration,
        ClassicDBDiscordServerUser,
        ClassicDBItem,
        ClassicDBItemQuery,
    ];

    public static async initialize(sequelize: Sequelize, force_synchronization = false): Promise<void> {
        this.initialize_models(sequelize);
        this.create_model_associations();
        await this.synchronize_models(force_synchronization);
    }

    private static initialize_models(sequelize: Sequelize): void {
        for (const model of this.models) {
            model.initialize(sequelize);
        }
    }

    private static create_model_associations(): void {
        for (const model of this.models) {
            model.create_associations();
        }
    }

    private static async synchronize_models(force = false): Promise<void> {
        for (const model of this.models) {
            await model.synchronize(force);
        }
    }
}
