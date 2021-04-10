import { DataTypes, Model, Sequelize } from "sequelize";

import { WeaponDamage } from "../parsers/weapon_damage";
import { default_model_options } from ".";
import { WeaponDamageRangeModel } from "./weapon_damage_range";

export class WeaponDamageModel extends Model {
    public id: number;
    public dps: number;
    public speed: number;
    public weapon_damage_ranges: WeaponDamageRangeModel[];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static async initialize(sequelize: Sequelize): Promise<Model<any, any>> {
        return WeaponDamageModel.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                dps: { type: DataTypes.DOUBLE, allowNull: false },
                speed: { type: DataTypes.DOUBLE, allowNull: false },
            },
            { sequelize, modelName: "weapon_damage", ...default_model_options },
        );
    }

    public static to_weapon_damage(model: WeaponDamageModel): WeaponDamage {
        const damage_ranges = model.weapon_damage_ranges.map((damage_range_model) => {
            return WeaponDamageRangeModel.to_weapon_damage_range(damage_range_model);
        });
        return { dps: model.dps, speed: model.speed, damage_ranges };
    }

    public static async associate(): Promise<void> {
        await Promise.all([WeaponDamageModel.hasMany(WeaponDamageRangeModel, { foreignKey: "weapon_damage_id" })]);
    }
}
