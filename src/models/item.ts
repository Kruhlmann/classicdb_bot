import { DataTypes, Model, Sequelize } from "sequelize";

import { default_model_options } from ".";
import { AttributeStatModel } from "./attributes";
import { ItemBindingModel } from "./binding";
import { ClassModel } from "./class";
import { ExpansionModel } from "./expansion";
import { PVPRankModel } from "./pvp_rank";
import { ItemQualityModel } from "./quality";
import { ReputationRequirementModel } from "./reputation_requirement";
import { SkillRequirementModel } from "./skill_requirement";
import { ItemSlotModel } from "./slot";
import { SpellModel } from "./spell";
import { ItemTypeModel } from "./type";
import { WeaponDamageModel } from "./weapon_damage";

export class ItemModel extends Model {
    public id: string;
    public item_id: number;
    public armor: number;
    public attributes: AttributeStatModel[];
    public binding: ItemBindingModel;
    public class_restrictions: ClassModel[];
    public block_value: number;
    public durability: number;
    public flavor_text: string;
    public level_requirement: number;
    public is_quest_item: boolean;
    public quality: ItemQualityModel;
    public starts_quest: string;
    public name: string;
    public thumbnail: string;
    public uniquely_equipped: boolean;
    public url: string;
    public expansion: ExpansionModel;
    public item_slot: ItemSlotModel;
    public item_type: ItemTypeModel;
    public weapon_damage: WeaponDamageModel;
    public reputation_requirement: ReputationRequirementModel;
    public skill_requirement: SkillRequirementModel;
    public pvp_rank: PVPRankModel;
    public spells: SpellModel[];

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
                armor: { type: DataTypes.INTEGER, allowNull: false },
                block_value: { type: DataTypes.INTEGER, allowNull: false },
                durability: { type: DataTypes.INTEGER, allowNull: false },
                flavor_text: { type: DataTypes.STRING, allowNull: false },
                level_requirement: { type: DataTypes.INTEGER, allowNull: false },
                is_quest_item: { type: DataTypes.BOOLEAN, allowNull: false },
                starts_quest: { type: DataTypes.STRING, allowNull: false },
                name: { type: DataTypes.STRING, allowNull: false },
                thumbnail: { type: DataTypes.STRING, allowNull: false },
                uniquely_equipped: { type: DataTypes.BOOLEAN, allowNull: false },
                url: { type: DataTypes.STRING, allowNull: false },
            },
            { sequelize, modelName: "item", ...default_model_options },
        );
    }

    public static async associate(): Promise<void> {
        await Promise.all([
            ItemModel.belongsTo(ExpansionModel, { foreignKey: "expansion_id" }),
            ItemModel.belongsTo(ItemBindingModel, { foreignKey: "binding_id" }),
            ItemModel.belongsTo(ItemQualityModel, { foreignKey: "quality_id" }),
            ItemModel.belongsTo(ItemSlotModel, { foreignKey: "slot_id" }),
            ItemModel.belongsTo(ItemTypeModel, { foreignKey: "type_id" }),
            ItemModel.belongsTo(WeaponDamageModel, { foreignKey: "weapon_damage_id" }),
            ItemModel.belongsTo(ReputationRequirementModel, { foreignKey: "reputation_requirement_id" }),
            ItemModel.belongsTo(SkillRequirementModel, { foreignKey: "skill_requirement_id" }),
            ItemModel.belongsTo(PVPRankModel, { foreignKey: "pvp_rank_id" }),
            ItemModel.hasMany(AttributeStatModel, { as: "attributes", foreignKey: "item_id", constraints: false }),
            ItemModel.hasMany(ClassModel, { as: "class_restrictions", foreignKey: "item_id", constraints: false }),
            ItemModel.hasMany(SpellModel, { as: "spells", foreignKey: "item_id", constraints: false }),
        ]);
    }
}
