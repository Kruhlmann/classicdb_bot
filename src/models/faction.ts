import { DataTypes, Model, Sequelize } from "sequelize";

import { default_model_options } from ".";

export class FactionModel extends Model {
    public id: number;
    public name: string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static async initialize(sequelize: Sequelize): Promise<Model<any, any>> {
        return FactionModel.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                name: { type: DataTypes.STRING, allowNull: false },
            },
            { sequelize, modelName: "faction", ...default_model_options },
        );
    }

    public static async associate(): Promise<void> {
        await Promise.all([]);
    }
}
