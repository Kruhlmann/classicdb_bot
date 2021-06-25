import { DataTypes, Model, Sequelize } from "sequelize";

import { ItemQuality, ItemQualityLookupTable } from "../parsers/quality";
import { default_model_options } from ".";

export class ItemQualityModel extends Model {
    public id: number;
    public name: string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static async initialize(sequelize: Sequelize): Promise<Model<any, any>> {
        return ItemQualityModel.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                name: { type: DataTypes.STRING, allowNull: false },
            },
            { sequelize, modelName: "quality", ...default_model_options },
        );
    }

    public static to_item_quality(model: ItemQualityModel): ItemQuality {
        return new ItemQualityLookupTable().perform_lookup(model.name);
    }

    public static async associate(): Promise<void> {
        await Promise.all([]);
    }
}
