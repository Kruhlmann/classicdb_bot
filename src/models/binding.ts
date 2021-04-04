import { DataTypes, Model, Sequelize } from "sequelize";

import { BindingLookupTable, ItemBinding } from "../parsers/binding";
import { default_model_options } from ".";
import { ItemModel } from "./item";

export class ItemBindingModel extends Model {
    public id: number;
    public type: string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static async initialize(sequelize: Sequelize): Promise<Model<any, any>> {
        return ItemBindingModel.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                type: { type: DataTypes.STRING, allowNull: false },
            },
            { sequelize, modelName: "binding", ...default_model_options },
        );
    }

    public static to_item_binding(model: ItemBindingModel): ItemBinding {
        return new BindingLookupTable().perform_lookup(model.type);
    }

    public static async associate(): Promise<void> {
        await Promise.all([]);
    }
}
