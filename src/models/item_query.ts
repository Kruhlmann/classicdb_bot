import { DataTypes, Model, Sequelize } from "sequelize";

import { default_model_options } from ".";
import { DiscordGuildModel } from "./discord_guild";
import { ItemModel } from "./item";

export class ItemQueryModel extends Model {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static async initialize(sequelize: Sequelize): Promise<Model<any, any>> {
        return ItemQueryModel.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
            },
            { sequelize, modelName: "query", ...default_model_options },
        );
    }

    public static async associate(): Promise<void> {
        await Promise.all([
            ItemQueryModel.belongsTo(DiscordGuildModel, { foreignKey: "guild_id" }),
            ItemQueryModel.belongsTo(ItemModel, { foreignKey: "item_id" }),
        ]);
    }
}
