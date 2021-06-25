import { DataTypes, Model, Sequelize } from "sequelize";

import { Slot, SlotLookupTable } from "../parsers/slot_type";
import { default_model_options } from ".";

export class ItemSlotModel extends Model {
    public id: number;
    public name: string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static async initialize(sequelize: Sequelize): Promise<Model<any, any>> {
        return ItemSlotModel.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                name: { type: DataTypes.STRING, allowNull: false },
            },
            { sequelize, modelName: "item_slot", ...default_model_options },
        );
    }

    public static to_item_slot(model: ItemSlotModel): Slot {
        return new SlotLookupTable().perform_lookup(model.name);
    }

    public static async associate(): Promise<void> {
        await Promise.all([]);
    }
}
