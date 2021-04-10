import { ILoggable } from "./logging";
import { ItemBindingModel } from "./models/binding";
import { DamageTypeModel } from "./models/damage_type";
import { ExpansionModel } from "./models/expansion";
import { ItemQualityModel } from "./models/quality";
import { ItemSlotModel } from "./models/slot";
import { ItemTypeModel } from "./models/type";

export interface IExternalItemStoragePreseeder {
    preseed(): Promise<void>;
}

export class PostgreSQLExternalItemStoragePreseeder implements IExternalItemStoragePreseeder {
    private logger: ILoggable;

    public constructor(logger: ILoggable) {
        this.logger = logger;
    }

    private async create_expansion_if_missing(expansion_name: string): Promise<void> {
        const model = await ExpansionModel.findOne({ where: { string_identifier: expansion_name } });
        if (!model) {
            await ExpansionModel.create({ string_identifier: expansion_name })
                .catch((error) => {
                    throw error;
                })
                .then();
            this.logger.log(`Created missing expansion: "${expansion_name}"`);
        }
    }

    private async create_binding_type_if_missing(binding_name: string): Promise<void> {
        const model = await ItemBindingModel.findOne({ where: { type: binding_name } });
        if (!model) {
            await ItemBindingModel.create({ type: binding_name })
                .catch((error) => {
                    throw error;
                })
                .then();
            this.logger.log(`Created missing item binding type: "${binding_name}"`);
        }
    }

    private async create_item_slot_if_missing(slot_name: string): Promise<void> {
        const model = await ItemSlotModel.findOne({ where: { name: slot_name } });
        if (!model) {
            await ItemSlotModel.create({ name: slot_name })
                .catch((error) => {
                    throw error;
                })
                .then();
            this.logger.log(`Created missing item slot: "${slot_name}"`);
        }
    }

    private async create_item_type_if_missing(slot_name: string): Promise<void> {
        const model = await ItemTypeModel.findOne({ where: { name: slot_name } });
        if (!model) {
            await ItemTypeModel.create({ name: slot_name })
                .catch((error) => {
                    throw error;
                })
                .then();
            this.logger.log(`Created missing item type: "${slot_name}"`);
        }
    }

    private async create_quality_if_missing(quality_name: string): Promise<void> {
        const model = await ItemQualityModel.findOne({ where: { name: quality_name } });
        if (!model) {
            await ItemQualityModel.create({ name: quality_name })
                .catch((error) => {
                    throw error;
                })
                .then();
            this.logger.log(`Created missing item quality: "${quality_name}"`);
        }
    }

    private async create_damage_type_if_missing(damage_type_name: string): Promise<void> {
        const model = await DamageTypeModel.findOne({ where: { name: damage_type_name } });
        if (!model) {
            await DamageTypeModel.create({ name: damage_type_name })
                .catch((error) => {
                    throw error;
                })
                .then();
            this.logger.log(`Created missing damage type: "${damage_type_name}"`);
        }
    }

    public async preseed(): Promise<void> {
        await Promise.all([
            this.create_expansion_if_missing("classic"),
            this.create_expansion_if_missing("tbc"),
            this.create_expansion_if_missing("wotlk"),
            this.create_expansion_if_missing("cata"),
            this.create_expansion_if_missing("mop"),
            this.create_expansion_if_missing("wod"),
            this.create_expansion_if_missing("legion"),
            this.create_expansion_if_missing("bfa"),
            this.create_binding_type_if_missing(""),
            this.create_binding_type_if_missing("pickup"),
            this.create_binding_type_if_missing("equip"),
            this.create_quality_if_missing(""),
            this.create_quality_if_missing("poor"),
            this.create_quality_if_missing("common"),
            this.create_quality_if_missing("uncommon"),
            this.create_quality_if_missing("rare"),
            this.create_quality_if_missing("epic"),
            this.create_quality_if_missing("legendary"),
            this.create_quality_if_missing("artifact"),
            this.create_quality_if_missing("heirloom"),
            this.create_item_slot_if_missing(""),
            this.create_item_slot_if_missing("head"),
            this.create_item_slot_if_missing("neck"),
            this.create_item_slot_if_missing("shoulder"),
            this.create_item_slot_if_missing("back"),
            this.create_item_slot_if_missing("chest"),
            this.create_item_slot_if_missing("shirt"),
            this.create_item_slot_if_missing("tabard"),
            this.create_item_slot_if_missing("wrist"),
            this.create_item_slot_if_missing("main hand"),
            this.create_item_slot_if_missing("one-hand"),
            this.create_item_slot_if_missing("off hand"),
            this.create_item_slot_if_missing("held in off-hand"),
            this.create_item_slot_if_missing("two-hand"),
            this.create_item_slot_if_missing("ranged"),
            this.create_item_slot_if_missing("thrown"),
            this.create_item_slot_if_missing("projectile"),
            this.create_item_slot_if_missing("relic"),
            this.create_item_slot_if_missing("hands"),
            this.create_item_slot_if_missing("waist"),
            this.create_item_slot_if_missing("legs"),
            this.create_item_slot_if_missing("feet"),
            this.create_item_slot_if_missing("finger"),
            this.create_item_slot_if_missing("trinket"),
            this.create_item_type_if_missing(""),
            this.create_item_type_if_missing("plate"),
            this.create_item_type_if_missing("mail"),
            this.create_item_type_if_missing("leather"),
            this.create_item_type_if_missing("cloth"),
            this.create_item_type_if_missing("sword"),
            this.create_item_type_if_missing("axe"),
            this.create_item_type_if_missing("mace"),
            this.create_item_type_if_missing("dagger"),
            this.create_item_type_if_missing("wand"),
            this.create_item_type_if_missing("idol"),
            this.create_item_type_if_missing("libram"),
            this.create_item_type_if_missing("totem"),
            this.create_item_type_if_missing("thrown"),
            this.create_item_type_if_missing("shield"),
            this.create_item_type_if_missing("fist weapon"),
            this.create_item_type_if_missing("staff"),
            this.create_item_type_if_missing("gun"),
            this.create_item_type_if_missing("bow"),
            this.create_item_type_if_missing("crossbow"),
            this.create_item_type_if_missing("bullet"),
            this.create_item_type_if_missing("arrow"),
            this.create_damage_type_if_missing(""),
            this.create_damage_type_if_missing("none"),
            this.create_damage_type_if_missing("fire"),
            this.create_damage_type_if_missing("frost"),
            this.create_damage_type_if_missing("arcane"),
            this.create_damage_type_if_missing("nature"),
            this.create_damage_type_if_missing("shadow"),
            this.create_damage_type_if_missing("holy"),
        ]).catch((error) => {
            throw error;
        });
        this.logger.debug("Pre-seeded database");
    }
}
