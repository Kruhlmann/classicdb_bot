import { ILoggable } from "./logging";
import { ItemBindingModel } from "./models/binding";
import { DamageTypeModel } from "./models/damage_type";
import { ExpansionModel } from "./models/expansion";
import { ItemQualityModel } from "./models/quality";
import { ReputationLevelModel } from "./models/reputation_level";
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

    private preseed_expansions(): Promise<void>[] {
        return ["classic", "tbc", "wotlk", "cata", "mop", "wod", "legion", "bfa"].map(async (string_identifier) => {
            await ExpansionModel.findOrCreate({ where: { string_identifier } });
        });
    }

    private preseed_bindings(): Promise<void>[] {
        return ["", "pickup", "equip"].map(async (type) => {
            await ItemBindingModel.findOrCreate({ where: { type } });
        });
    }

    private preseed_qualities(): Promise<void>[] {
        return ["", "poor", "common", "uncommon", "rare", "epic", "legendary", "artifact", "heirloom"].map(
            async (name) => {
                await ItemQualityModel.findOrCreate({ where: { name } });
            },
        );
    }

    private preseed_slots(): Promise<void>[] {
        return [
            "",
            "head",
            "neck",
            "shoulder",
            "back",
            "chest",
            "shirt",
            "tabard",
            "wrist",
            "main hand",
            "one-hand",
            "off hand",
            "held in off-hand",
            "two-hand",
            "ranged",
            "thrown",
            "projectile",
            "relic",
            "hands",
            "waist",
            "legs",
            "feet",
            "finger",
            "trinket",
        ].map(async (name) => {
            await ItemSlotModel.findOrCreate({ where: { name } });
        });
    }

    private preseed_item_types(): Promise<void>[] {
        return [
            "",
            "plate",
            "mail",
            "leather",
            "cloth",
            "sword",
            "axe",
            "mace",
            "dagger",
            "wand",
            "idol",
            "libram",
            "totem",
            "thrown",
            "shield",
            "fist weapon",
            "staff",
            "gun",
            "bow",
            "crossbow",
            "bullet",
            "arrow",
        ].map(async (name) => {
            await ItemTypeModel.findOrCreate({ where: { name } });
        });
    }

    private preseed_damage_types(): Promise<void>[] {
        return ["", "none", "fire", "frost", "arcane", "nature", "shadow", "holy"].map(async (name) => {
            await DamageTypeModel.findOrCreate({ where: { name } });
        });
    }

    private preseed_reputation_levels(): Promise<void>[] {
        return [
            "",
            "paragon",
            "exalted",
            "revered",
            "honored",
            "friendly",
            "neutral",
            "unfriendly",
            "hostile",
            "hated",
        ].map(async (name) => {
            await ReputationLevelModel.findOrCreate({ where: { name } });
        });
    }

    public async preseed(): Promise<void> {
        await Promise.all([
            ...this.preseed_expansions(),
            ...this.preseed_bindings(),
            ...this.preseed_qualities(),
            ...this.preseed_slots(),
            ...this.preseed_item_types(),
            ...this.preseed_damage_types(),
            ...this.preseed_reputation_levels(),
        ]);
        this.logger.debug("Pre-seeded database");
    }
}
