import { DataTypes, Model, Sequelize } from "sequelize";

import { Expansion } from "../expansion";
import { ClassicDBSpell, ISpell, TBCDBSpell } from "../spell";
import { default_model_options } from ".";

export class SpellModel extends Model {
    public spell_id: number;
    public name: string;
    public description: string;
    public url: string;
    public thumbnail_url: string;
    public trigger: string;
    public cast_time: number;
    public range: number;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static async initialize(sequelize: Sequelize): Promise<Model<any, any>> {
        return SpellModel.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                spell_id: { type: DataTypes.INTEGER, allowNull: false },
                name: { type: DataTypes.STRING, allowNull: false },
                description: { type: DataTypes.STRING, allowNull: false },
                url: { type: DataTypes.STRING, allowNull: false },
                thumbnail_url: { type: DataTypes.STRING, allowNull: false },
                cast_time: { type: DataTypes.DOUBLE, allowNull: false },
                range: { type: DataTypes.INTEGER, allowNull: false },
                trigger: { type: DataTypes.STRING, allowNull: false },
            },
            { sequelize, modelName: "spell", ...default_model_options },
        );
    }

    public static to_spell(model: SpellModel, expansion: Expansion): ISpell {
        if (expansion === Expansion.TBC) {
            return new TBCDBSpell(
                model.spell_id,
                model.name,
                model.description,
                model.url,
                model.thumbnail_url,
                model.trigger,
                model.cast_time,
                model.range,
            );
        }
        return new ClassicDBSpell(
            model.spell_id,
            model.name,
            model.description,
            model.url,
            model.thumbnail_url,
            model.trigger,
            model.cast_time,
            model.range,
        );
    }

    public static async associate(): Promise<void> {
        await Promise.all([]);
    }
}
