import { DataTypes, Model, Sequelize } from "sequelize";

import { PVPRank, PVPRankLookupTable } from "../parsers/rank";
import { default_model_options } from ".";

export class PVPRankModel extends Model {
    public id: number;
    public name: string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static async initialize(sequelize: Sequelize): Promise<Model<any, any>> {
        return PVPRankModel.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                name: { type: DataTypes.STRING, allowNull: false },
            },
            { sequelize, modelName: "pvp_rank", ...default_model_options },
        );
    }

    public static to_pvp_rank(model: PVPRankModel): PVPRank {
        return new PVPRankLookupTable().perform_lookup(model.name);
    }

    public static async associate(): Promise<void> {
        await Promise.all([]);
    }
}
