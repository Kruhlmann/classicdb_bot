import { DataTypes, Model, Sequelize } from "sequelize";

import { Skill, SkillLookupTable } from "../parsers/skill";
import { default_model_options } from ".";

export class SkillModel extends Model {
    public id: number;
    public name: string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static async initialize(sequelize: Sequelize): Promise<Model<any, any>> {
        return SkillModel.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                name: { type: DataTypes.STRING, allowNull: false },
            },
            { sequelize, modelName: "skill", ...default_model_options },
        );
    }

    public static to_skill(model: SkillModel): Skill {
        return new SkillLookupTable().perform_lookup(model.name);
    }

    public static async associate(): Promise<void> {
        await Promise.all([]);
    }
}
