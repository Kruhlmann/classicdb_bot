import { DataTypes, Model, Sequelize } from "sequelize";

import { ReputationState, ReputationStateLookupTable } from "../parsers/reputation";
import { default_model_options } from ".";

export class ReputationLevelModel extends Model {
    public id: number;
    public name: string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static async initialize(sequelize: Sequelize): Promise<Model<any, any>> {
        return ReputationLevelModel.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                name: { type: DataTypes.STRING, allowNull: false },
            },
            { sequelize, modelName: "reputation_level", ...default_model_options },
        );
    }

    public static to_item_binding(model: ReputationLevelModel): ReputationState {
        return new ReputationStateLookupTable().perform_lookup(model.name);
    }

    public static async associate(): Promise<void> {
        await Promise.all([]);
    }
}
