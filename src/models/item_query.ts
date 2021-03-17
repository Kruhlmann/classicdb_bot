import { DataTypes, Model, Sequelize } from "sequelize";

import { ClassicDBDiscordServer } from "./discord_server";
import { ClassicDBDiscordServerUser } from "./discord_user";
import { ClassicDBExpansion } from "./expansion";
import { ClassicDBItem } from "./item";

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
            { sequelize, modelName: "item_query", underscored: true, createdAt: "created_at", updatedAt: "updated_at" },
        );
    }

    public static create_associations(): void {
        ClassicDBItemQuery.belongsTo(ClassicDBDiscordServer, { foreignKey: { name: "discord_server_id" } });
        ClassicDBItemQuery.belongsTo(ClassicDBDiscordServerUser, { foreignKey: { name: "discord_user_id" } });
        ClassicDBItemQuery.belongsTo(ClassicDBExpansion, { foreignKey: { name: "expansion_id" } });
        ClassicDBItemQuery.belongsTo(ClassicDBItem, { foreignKey: { name: "item_id" } });
    }

    public static async synchronize(force = false): Promise<void> {
        this.sync({ force });
    }
}
