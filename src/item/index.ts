import { Expansion, ExpansionLookupTable } from "../expansion";
import { AttributeStatModel } from "../models/attributes";
import { ClassModel } from "../models/class";
import { ItemModel } from "../models/item";
import { ItemQualityModel } from "../models/quality";
import { WeaponDamageModel } from "../models/weapon_damage";
import { AttributeStat } from "../parsers/attributes";
import { BindingLookupTable, ItemBinding } from "../parsers/binding";
import { Class } from "../parsers/class";
import { ItemQuality, ItemQualityLookupTable } from "../parsers/quality";
import { PVPRank } from "../parsers/rank";
import { ReputationRequirement, ReputationState } from "../parsers/reputation";
import { Skill, SkillRequirement } from "../parsers/skill";
import { Slot, SlotLookupTable, Type, TypeLookupTable } from "../parsers/slot_type";
import { WeaponDamage } from "../parsers/weapon_damage";
import { ISpell } from "../spell";
import { ReputationRequirementModel } from "../models/reputation_requirement";

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
    level_requirement: number;
    name: string;
    quality: ItemQuality;
    quest: string | boolean;
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
    public readonly level_requirement: number;
    public readonly name: string;
    public readonly quality: ItemQuality;
    public readonly quest: string | boolean;
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
        name: string,
        quality: ItemQuality,
        quest: string | boolean,
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
        this.level_requirement = level_requirement;
        this.name = name;
        this.quality = quality;
        this.quest = quest;
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

    public static from_model(model: ItemModel): IItem {
        const expansion = new ExpansionLookupTable().perform_lookup(model.expansion.string_identifier);
        const attributes = model.attributes.map((model) => AttributeStatModel.to_attribute_stat(model));
        const binding = new BindingLookupTable().perform_lookup(model.binding.type);
        const classes = model.class_restrictions.map((model) => ClassModel.to_class(model));
        const quality = new ItemQualityLookupTable().perform_lookup(model.quality.name);
        const slot = new SlotLookupTable().perform_lookup(model.item_slot.name);
        const type = new TypeLookupTable().perform_lookup(model.item_type.name);
        const weapon_damage = WeaponDamageModel.to_weapon_damage(model.weapon_damage);
        const reputation_requirement = ReputationRequirementModel.to_reputation_requirement(
            model.reputation_requirement,
        );

        return new Item(
            model.item_id,
            model.armor,
            attributes,
            binding,
            model.block_value,
            classes,
            model.durability,
            expansion,
            model.flavor_text,
            model.level_requirement,
            model.name,
            quality,
            "",
            slot,
            type,
            model.thumbnail,
            model.uniquely_equipped,
            weapon_damage,
            reputation_requirement,
            { skill: Skill.NONE, value: -1 },
            PVPRank.NONE,
            model.url,
            [],
        );
    }
}
