import { DataTypes, Model, Sequelize } from "sequelize";

import { default_model_options } from ".";
import { ItemModel } from "./item";
import { AttributeStat, AttributeLookupTable } from "../parsers/attributes";

export class AttributeStatModel extends Model {
    public id: number;
    public type: string;
    public value: number;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static async initialize(sequelize: Sequelize): Promise<Model<any, any>> {
        return AttributeStatModel.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                type: { type: DataTypes.STRING, allowNull: false },
                value: { type: DataTypes.INTEGER, allowNull: false },
            },
            { sequelize, modelName: "attributestat", ...default_model_options },
        );
    }

    public static to_attribute_stat(model: AttributeStatModel): AttributeStat {
        const type = new AttributeLookupTable().perform_lookup(model.type);
        return { type, value: model.value };
    }

    public static async associate(): Promise<void> {
        await Promise.all([AttributeStatModel.belongsTo(ItemModel, { foreignKey: "item_id" })]);
    }
}
