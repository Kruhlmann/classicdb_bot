import { DataTypes, Model, Sequelize } from "sequelize";

import { Class, ClassLookupTable } from "../parsers/class";
import { default_model_options } from ".";

export class ClassModel extends Model {
    public id: number;
    public name: string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static async initialize(sequelize: Sequelize): Promise<Model<any, any>> {
        return ClassModel.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                name: { type: DataTypes.STRING, allowNull: false },
            },
            { sequelize, modelName: "class", ...default_model_options },
        );
    }

    public static to_class(model: ClassModel): Class {
        return new ClassLookupTable().perform_lookup(model.name);
    }

    public static async associate(): Promise<void> {
        await Promise.all([]);
    }
}
