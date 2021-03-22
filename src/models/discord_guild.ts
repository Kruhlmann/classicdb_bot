import { DataTypes, Model, Sequelize } from "sequelize";

import { default_model_options } from ".";

export class DiscordGuild extends Model {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static async initialize(sequelize: Sequelize): Promise<Model<any, any>> {
        return DiscordGuild.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                guild_id: { type: DataTypes.STRING, unique: true },
            },
            { sequelize, modelName: "discord_guild", ...default_model_options },
        );
    }

    public static async associate(): Promise<void> {
        return new Promise((resolve) => resolve);
    }
}
