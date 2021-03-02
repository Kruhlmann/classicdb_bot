import { DataTypes, Sequelize, Model } from "sequelize";
import { ClassicDBItem } from "./item";
import { ClassicDBExpansion } from "./expansion";
import { ClassicDBDiscordServerUser } from "./discord_user";
import { ClassicDBDiscordServer as ClassicDBDiscordUser } from "./discord_server";

export class ClassicDBItemQuery extends Model {
    public static initialize(sequelize: Sequelize): void {
        this.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                request_count: { type: DataTypes.INTEGER },
            },
            { sequelize, modelName: "item_query", underscored: true, createdAt: "created_at", updatedAt: "updated_at" }
        );
    }

    public static create_associations(): void {
        ClassicDBItemQuery.belongsTo(ClassicDBDiscordUser, { foreignKey: { name: "discord_user_id" } });
        ClassicDBItemQuery.belongsTo(ClassicDBExpansion, { foreignKey: { name: "expansion_id" } });
        ClassicDBItemQuery.belongsTo(ClassicDBItem, { foreignKey: { name: "item_id" } });
    }

    public static async synchronize(force = false): Promise<void> {
        this.sync({ force });
    }
}
