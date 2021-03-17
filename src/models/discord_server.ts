import { DataTypes, Model, Sequelize } from "sequelize";

export class ClassicDBDiscordServer extends Model {
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
                modelName: "discord_server",
                underscored: true,
                createdAt: "created_at",
                updatedAt: "updated_at",
            },
        );
    }

    public static create_associations(): void {}

    public static async synchronize(force = false): Promise<void> {
        this.sync({ force });
    }
}
