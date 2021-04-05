import { DataTypes, Model, Sequelize } from "sequelize";

import { default_model_options } from ".";
import { AttributeStatModel } from "./attributes";
import { ItemBindingModel } from "./binding";
import { ClassModel } from "./class";
import { ExpansionModel } from "./expansion";

export class ItemModel extends Model {
    public item_id: number;
    public armor: number;
    public attributes: AttributeStatModel[];
    public binding: ItemBindingModel;
    public class_restrictions: ClassModel[];
    public block_value: number;
    public durability: number;
    public flavor_text: string;
    public level_requirement: number;
    public name: string;
    public thumbnail: string;
    public uniquely_equipped: boolean;
    public url: string;
    public expansion: ExpansionModel;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static async initialize(sequelize: Sequelize): Promise<Model<any, any>> {
        return ItemModel.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                item_id: { type: DataTypes.INTEGER, allowNull: false },
                armor: { type: DataTypes.INTEGER },
                block_value: { type: DataTypes.INTEGER },
                durability: { type: DataTypes.INTEGER },
                flavor_text: { type: DataTypes.STRING },
                level_requirement: { type: DataTypes.INTEGER },
                name: { type: DataTypes.STRING },
                thumbnail: { type: DataTypes.STRING },
                uniquely_equipped: { type: DataTypes.BOOLEAN },
                url: { type: DataTypes.STRING },
            },
            { sequelize, modelName: "item", ...default_model_options },
        );
    }

    public static async associate(): Promise<void> {
        await Promise.all([
            ItemModel.belongsTo(ExpansionModel, { foreignKey: "expansion_id" }),
            ItemModel.hasMany(AttributeStatModel, { as: "attributes", foreignKey: "item_id" }),
            ItemModel.hasMany(ClassModel, { as: "class_restrictions", foreignKey: "item_id" }),
            ItemModel.belongsTo(ItemBindingModel, { foreignKey: "binding_id" }),
        ]);
    }
}
