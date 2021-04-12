import { DataTypes, Model, Sequelize } from "sequelize";

import { IItem } from "../item";
import { SkillLookupTable, SkillRequirement } from "../parsers/skill";
import { default_model_options } from ".";
import { SkillModel } from "./skill";

export class SkillRequirementModel extends Model {
    public id: number;
    public requirement: number;
    public skill: SkillModel;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static async initialize(sequelize: Sequelize): Promise<Model<any, any>> {
        return SkillRequirementModel.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                requirement: { type: DataTypes.INTEGER, allowNull: false },
            },
            { sequelize, modelName: "skill_requirement", ...default_model_options },
        );
    }

    public static to_skill_requirement(model: SkillRequirementModel): SkillRequirement {
        const skill = SkillModel.to_skill(model.skill);
        return { value: model.requirement, skill };
    }

    public static async store_for_item(item: IItem): Promise<SkillRequirementModel> {
        const skill_name = new SkillLookupTable().perform_reverse_lookup(item.skill_requirement.skill);
        const skill = await SkillModel.findOne({ where: { name: skill_name } });
        return SkillRequirementModel.create({
            requirement: item.skill_requirement.value,
            skill_id: skill.id,
        });
    }

    public static async associate(): Promise<void> {
        await Promise.all([SkillRequirementModel.belongsTo(SkillModel, { foreignKey: "skill_id" })]);
    }
}
