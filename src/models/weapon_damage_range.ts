import { DataTypes, Model, Sequelize } from "sequelize";

import { DamageTypeLookupTable } from "../parsers/damage_type";
import { WeaponDamageRange } from "../parsers/weapon_damage";
import { default_model_options } from ".";
import { DamageTypeModel } from "./damage_type";

export class WeaponDamageRangeModel extends Model {
    public id: number;
    public low: number;
    public high: number;
    public damage_type: DamageTypeModel;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static async initialize(sequelize: Sequelize): Promise<Model<any, any>> {
        return WeaponDamageRangeModel.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                low: { type: DataTypes.INTEGER, allowNull: false },
                high: { type: DataTypes.INTEGER, allowNull: false },
            },
            { sequelize, modelName: "weapon_damage_range", ...default_model_options },
        );
    }

    public static to_weapon_damage_range(model: WeaponDamageRangeModel): WeaponDamageRange {
        const damage_type = new DamageTypeLookupTable().perform_lookup(model.damage_type.name);
        return { low: model.low, high: model.high, type: damage_type };
    }

    public static async associate(): Promise<void> {
        await Promise.all([WeaponDamageRangeModel.belongsTo(DamageTypeModel, { foreignKey: "damage_type_id" })]);
    }
}
