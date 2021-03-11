import { WeaponDamage } from "../parsers/weapon_damage";
import { Type, Slot } from "../parsers/slot_type";
import { Expansion } from "../expansion";
import { ItemBinding } from "../parsers/binding";
import { AttributeStat } from "../parsers/attributes";

export class Item {
    public readonly armor: number;
    public readonly attributes: AttributeStat[];
    public readonly binding: ItemBinding;
    public readonly block_value: number;
    public readonly class_restrictions: string[];
    public readonly durability: number;
    public readonly expansion: Expansion;
    public readonly flavor_text: string;
    public readonly level_requirement: number;
    public readonly name: string;
    public readonly quality: string;
    public readonly quest: string | boolean;
    public readonly slot: Slot;
    public readonly type: Type;
    public readonly thumbnail: string;
    public readonly uniquely_equipped: boolean;
    public readonly damage: WeaponDamage;
    public readonly url: string;

    public constructor(
        armor: number,
        attributes: AttributeStat[],
        binding: ItemBinding,
        block_value: number,
        class_restrictions: string[],
        durability: number,
        expansion: Expansion,
        flavor_text: string,
        level_requirement: number,
        name: string,
        quality: string,
        quest: string | boolean,
        slot: Slot,
        type: Type,
        thumbnail: string,
        uniquely_equipped: boolean,
        damage: WeaponDamage,
        url: string
    ) {
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
        this.url = url;
    }
}
