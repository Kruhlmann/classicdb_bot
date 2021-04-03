import { DataTypes, Model, Sequelize } from "sequelize";

import { default_model_options } from ".";

export class ExpansionModel extends Model {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static async initialize(sequelize: Sequelize): Promise<Model<any, any>> {
        return ExpansionModel.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                string_identifier: { type: DataTypes.STRING, unique: true },
            },
            { sequelize, modelName: "expansion", ...default_model_options },
        );
    }

    public static async associate(): Promise<void> {}
}
