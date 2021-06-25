import { DataTypes, Model, Sequelize } from "sequelize";

import { Expansion, ExpansionLookupTable } from "../expansion";
import { default_model_options } from ".";

export class ExpansionModel extends Model {
    public id: string;
    public string_identifier: string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static async initialize(sequelize: Sequelize): Promise<Model<any, any>> {
        return ExpansionModel.init(
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                string_identifier: { type: DataTypes.STRING, unique: true },
            },
            { sequelize, modelName: "expansion", ...default_model_options },
        );
    }

    public static to_expansion(model: ExpansionModel): Expansion {
        return new ExpansionLookupTable().perform_lookup(model.string_identifier);
    }

    public static async associate(): Promise<void> {}
}
