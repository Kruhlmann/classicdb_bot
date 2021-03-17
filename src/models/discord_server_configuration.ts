import { DataTypes, Model, Sequelize } from "sequelize";

import { ClassicDBDiscordServer } from "./discord_server";
import { ClassicDBExpansion } from "./expansion";

export class ClassicDBDiscordServerConfiguration extends Model {
    public static initialize(sequelize: Sequelize): void {
        this.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                memes_enabled: { type: DataTypes.BOOLEAN },
            },
            {
                sequelize,
                modelName: "discord_server_configuration",
                underscored: true,
                createdAt: "created_at",
                updatedAt: "updated_at",
            },
        );
    }

    public static create_associations(): void {
        ClassicDBDiscordServerConfiguration.belongsTo(ClassicDBDiscordServer, {
            foreignKey: { name: "server_id", allowNull: false },
        });
        ClassicDBDiscordServerConfiguration.hasOne(ClassicDBExpansion, {
            foreignKey: { name: "default_expansion_id", allowNull: false },
        });
    }

    public static async synchronize(force = false): Promise<void> {
        this.sync({ force });
    }
}
