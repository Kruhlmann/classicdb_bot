import { DataTypes, Model, Sequelize } from "sequelize";

import { ReputationRequirement, ReputationStateLookupTable } from "../parsers/reputation";
import { default_model_options } from ".";
import { FactionModel } from "./faction";
import { ReputationLevelModel } from "./reputation_level";

export class ReputationRequirementModel extends Model {
    public id: number;
    public reputation_level: ReputationLevelModel;
    public faction: FactionModel;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static async initialize(sequelize: Sequelize): Promise<Model<any, any>> {
        return ReputationRequirementModel.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
            },
            { sequelize, modelName: "reputation_requirement", ...default_model_options },
        );
    }

    public static to_reputation_requirement(model: ReputationRequirementModel): ReputationRequirement {
        const state = new ReputationStateLookupTable().perform_lookup(model.reputation_level.name);
        return { state, name: model.faction.name };
    }

    public static async associate(): Promise<void> {
        await Promise.all([
            ReputationRequirementModel.belongsTo(ReputationLevelModel, { foreignKey: "reputation_level_id" }),
            ReputationRequirementModel.belongsTo(FactionModel, { foreignKey: "faction_id" }),
        ]);
    }
}
