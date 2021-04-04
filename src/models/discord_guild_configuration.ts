import { DataTypes, Model, Sequelize } from "sequelize";

import { default_model_options } from ".";
import { DiscordGuildModel } from "./discord_guild";
import { ExpansionModel } from "./expansion";

export class DiscordGuildConfigurationModel extends Model {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static async initialize(sequelize: Sequelize): Promise<Model<any, any>> {
        return DiscordGuildConfigurationModel.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                memes_enabled: { type: DataTypes.BOOLEAN, defaultValue: false },
            },
            { sequelize, modelName: "discord_guild_configuration", ...default_model_options },
        );
    }

    public static async associate(): Promise<void> {
        await Promise.all([
            DiscordGuildConfigurationModel.belongsTo(DiscordGuildModel, { foreignKey: "discord_guild_id" }),
            DiscordGuildConfigurationModel.belongsTo(ExpansionModel, { foreignKey: "default_expansion_id" }),
        ]);
    }
}
