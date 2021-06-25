import { Expansion } from "../expansion";
import { AttributeStat } from "../parsers/attributes";
import { ItemBinding } from "../parsers/binding";
import { Class } from "../parsers/class";
import { ItemQuality } from "../parsers/quality";
import { PVPRank } from "../parsers/rank";
import { ReputationRequirement } from "../parsers/reputation";
import { SkillRequirement } from "../parsers/skill";
import { Slot, Type } from "../parsers/slot_type";
import { WeaponDamage } from "../parsers/weapon_damage";
import { ISpell } from "../spell";

export interface IItem {
    id: number;
    armor: number;
    attributes: AttributeStat[];
    binding: ItemBinding;
    block_value: number;
    class_restrictions: Class[];
    durability: number;
    expansion: Expansion;
    flavor_text: string;
    is_quest_item: boolean;
    level_requirement: number;
    name: string;
    quality: ItemQuality;
    starts_quest: string;
    slot: Slot;
    type: Type;
    thumbnail: string;
    uniquely_equipped: boolean;
    damage: WeaponDamage;
    reputation_requirement: ReputationRequirement;
    skill_requirement: SkillRequirement;
    rank_requirement: PVPRank;
    url: string;
    spells: ISpell[];
    simple_spells: ISpell[];
    complex_spells: ISpell[];
}

export class Item {
    public readonly id: number;
    public readonly armor: number;
    public readonly attributes: AttributeStat[];
    public readonly binding: ItemBinding;
    public readonly block_value: number;
    public readonly class_restrictions: Class[];
    public readonly durability: number;
    public readonly expansion: Expansion;
    public readonly flavor_text: string;
    public readonly is_quest_item: boolean;
    public readonly level_requirement: number;
    public readonly name: string;
    public readonly quality: ItemQuality;
    public readonly starts_quest: string;
    public readonly slot: Slot;
    public readonly type: Type;
    public readonly thumbnail: string;
    public readonly uniquely_equipped: boolean;
    public readonly damage: WeaponDamage;
    public readonly reputation_requirement: ReputationRequirement;
    public readonly skill_requirement: SkillRequirement;
    public readonly rank_requirement: PVPRank;
    public readonly url: string;
    public readonly spells: ISpell[];

    public constructor(
        id: number,
        armor: number,
        attributes: AttributeStat[],
        binding: ItemBinding,
        block_value: number,
        class_restrictions: Class[],
        durability: number,
        expansion: Expansion,
        flavor_text: string,
        level_requirement: number,
        is_quest_item: boolean,
        name: string,
        quality: ItemQuality,
        quest: string,
        slot: Slot,
        type: Type,
        thumbnail: string,
        uniquely_equipped: boolean,
        damage: WeaponDamage,
        reputation_requirement: ReputationRequirement,
        skill_requirement: SkillRequirement,
        rank_requirement: PVPRank,
        url: string,
        spells: ISpell[],
    ) {
        this.id = id;
        this.armor = armor;
        this.attributes = attributes;
        this.binding = binding;
        this.block_value = block_value;
        this.class_restrictions = class_restrictions;
        this.durability = durability;
        this.expansion = expansion;
        this.flavor_text = flavor_text;
        this.is_quest_item = is_quest_item;
        this.level_requirement = level_requirement;
        this.name = name;
        this.quality = quality;
        this.starts_quest = quest;
        this.slot = slot;
        this.type = type;
        this.thumbnail = thumbnail;
        this.uniquely_equipped = uniquely_equipped;
        this.damage = damage;
        this.reputation_requirement = reputation_requirement;
        this.skill_requirement = skill_requirement;
        this.rank_requirement = rank_requirement;
        this.url = url;
        this.spells = spells;
    }

    public get simple_spells(): ISpell[] {
        return this.spells.filter((spell) => spell.is_simple);
    }

    public get complex_spells(): ISpell[] {
        return this.spells.filter((spell) => !spell.is_simple);
    }
}
