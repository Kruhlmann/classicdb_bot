import { DataTypes, Model, Sequelize } from "sequelize";

import { Type, TypeLookupTable } from "../parsers/slot_type";
import { default_model_options } from ".";

export class ItemTypeModel extends Model {
    public id: number;
    public name: string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static async initialize(sequelize: Sequelize): Promise<Model<any, any>> {
        return ItemTypeModel.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                name: { type: DataTypes.STRING, allowNull: false },
            },
            { sequelize, modelName: "item_type", ...default_model_options },
        );
    }

    public static to_item_quality(model: ItemTypeModel): Type {
        return new TypeLookupTable().perform_lookup(model.name);
    }

    public static async associate(): Promise<void> {
        await Promise.all([]);
    }
}
