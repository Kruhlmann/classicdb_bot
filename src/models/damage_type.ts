import { DataTypes, Model, Sequelize } from "sequelize";

import { DamageType, DamageTypeLookupTable } from "../parsers/damage_type";
import { default_model_options } from ".";

export class DamageTypeModel extends Model {
    public id: number;
    public name: string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static async initialize(sequelize: Sequelize): Promise<Model<any, any>> {
        return DamageTypeModel.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                name: { type: DataTypes.STRING, allowNull: false },
            },
            { sequelize, modelName: "damage_type", ...default_model_options },
        );
    }

    public static to_damage_type(model: DamageTypeModel): DamageType {
        return new DamageTypeLookupTable().perform_lookup(model.name);
    }

    public static async associate(): Promise<void> {
        await Promise.all([]);
    }
}
