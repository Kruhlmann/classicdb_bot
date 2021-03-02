import { DataTypes, Sequelize, Model } from "sequelize";

export class ClassicDBItem extends Model {
    public static initialize(sequelize: Sequelize): void {
        this.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                name: { type: DataTypes.STRING, allowNull: false },
                wow_id: { type: DataTypes.INTEGER, allowNull: false },
            },
            { sequelize, modelName: "item", underscored: true, createdAt: "created_at", updatedAt: "updated_at" }
        );
    }

    public static create_associations(): void {}

    public static async synchronize(force = false): Promise<void> {
        this.sync({ force });
    }
}
