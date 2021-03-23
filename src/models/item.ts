import { DataTypes, Model, Sequelize } from "sequelize";

import { default_model_options } from ".";

export class ItemModel extends Model {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static async initialize(sequelize: Sequelize): Promise<Model<any, any>> {
        return ItemModel.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                armor: { type: DataTypes.INTEGER },
                block_value: { type: DataTypes.INTEGER },
                durability: { type: DataTypes.INTEGER },
                flavor_text: { type: DataTypes.STRING },
                level_requirement: { type: DataTypes.INTEGER },
                name: { type: DataTypes.STRING },
                thumbnail: { type: DataTypes.STRING },
                uniquely_equipped: { type: DataTypes.BOOLEAN },
                url: { type: DataTypes.STRING },
            },
            { sequelize, modelName: "item", ...default_model_options },
        );
    }

    public static async associate(): Promise<void> {}
}
