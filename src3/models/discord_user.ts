import { DataTypes, Sequelize, Model } from "sequelize";
import { ClassicDBDiscordServer } from "./discord_server";

export class ClassicDBDiscordServerUser extends Model {
    public static initialize(sequelize: Sequelize): void {
        this.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                discord_id: { type: DataTypes.INTEGER },
                name: { type: DataTypes.STRING },
            },
            {
                sequelize,
                modelName: "discord_user",
                underscored: true,
                createdAt: "created_at",
                updatedAt: "updated_at",
            }
        );
    }

    public static create_associations(): void {
        ClassicDBDiscordServerUser.belongsTo(ClassicDBDiscordServer, {
            foreignKey: { name: "server_id", allowNull: false },
        });
    }

    public static async synchronize(force = false): Promise<void> {
        this.sync({ force });
    }
}
