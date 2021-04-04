import { DataTypes, Model, Sequelize } from "sequelize";

import { Expansion, ExpansionLookupTable } from "../expansion";
import { default_model_options } from ".";
import { DiscordGuildConfigurationModel } from "./discord_guild_configuration";
import { ExpansionModel } from "./expansion";

export class DiscordGuildModel extends Model {
    public id: string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static async initialize(sequelize: Sequelize): Promise<Model<any, any>> {
        return DiscordGuildModel.init(
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

    public static async get_default_expansion(discord_guild_id: string): Promise<Expansion> {
        const guild = await DiscordGuildModel.findOne({ where: { guild_id: discord_guild_id } });
        const config = await DiscordGuildConfigurationModel.findOne({
            where: { discord_guild_id: guild.id },
            include: [ExpansionModel],
        });
        const expansion_string = config.expansion.string_identifier;
        const lookup_table = new ExpansionLookupTable();
        return lookup_table.perform_lookup(expansion_string);
    }

    public static async associate(): Promise<void> {}
}
