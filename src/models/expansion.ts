import { DataTypes, Model, Sequelize } from "sequelize";

export class ClassicDBExpansion extends Model {
    public static initialize(sequelize: Sequelize): void {
        this.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                prefix: { type: DataTypes.STRING, allowNull: false },
                name: { type: DataTypes.STRING, allowNull: false },
            },
            { sequelize, modelName: "expansion", underscored: true, createdAt: "created_at", updatedAt: "updated_at" },
        );
    }

    public static create_associations(): void {}

    public static async synchronize(force = false): Promise<void> {
        return this.sync({ force }).then();
    }
}
