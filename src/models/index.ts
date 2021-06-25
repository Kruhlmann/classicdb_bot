import { Model, Sequelize, SyncOptions } from "sequelize";

import { ILoggable } from "../logging";

export interface IInitializeableDatabaseModel {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialize(sequelize: Sequelize): Promise<Model<any, any>>;
    associate(): Promise<void>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sync<ModelType extends Model<any, any>>(options?: SyncOptions | undefined): Promise<ModelType>;
}

export const default_model_options = { underscored: true, createdAt: "created_at", updatedAt: "updated_at" };

export class DatabaseModelBuilder {
    private readonly database: Sequelize;
    private readonly logger: ILoggable;

    public constructor(database: Sequelize, logger: ILoggable) {
        this.database = database;
        this.logger = logger;
    }

    public async initialize(models: IInitializeableDatabaseModel[], force_override_models = true): Promise<void> {
        if (force_override_models) {
            this.logger.warning("Force synching database models");
        }
        await this.initialize_models(models);
        await this.create_model_database_associations(models);
        await this.database.sync({ force: force_override_models });
        this.logger.debug("Models initialized");
    }

    private async initialize_models(models: IInitializeableDatabaseModel[]): Promise<void> {
        for (const model of models) {
            await model.initialize(this.database);
            this.logger.debug(`Initialized database model ${model.name}`);
        }
    }

    private async create_model_database_associations(models: IInitializeableDatabaseModel[]): Promise<void> {
        for (const model of models) {
            await model.associate();
            this.logger.debug(`Created database model associations for ${model.name}`);
        }
    }
}
