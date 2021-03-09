import { AttributeStat, AttributeParser } from "../parsers/attributes";
import { ItemBinding, BindingParser } from "../parsers/binding";
import { Expansion } from "../expansion";
import { Slot, Type, SlotTypeParser } from "../parsers/slot_type";
import { WeaponDamage, WeaponDamageParser } from "../parsers/weapon_damage";
import { ArmorValueParser } from "../parsers/armor";
import { BlockValueParser } from "../parsers/block_value";
import { ClassicDBClassParser, TBCDBClassParser } from "../parsers/class";
import { DurabilityParser } from "../parsers/durability";
import { FlavorTextParser } from "../parsers/flavor_text";
import { LevelRequirementParser } from "../parsers/level";
import { ClassicDBNameParser, TBCDBNameParser } from "../parsers/name";
import { QualityParser } from "../parsers/quality";
import { ClassicDBBeginsQuestParser, TBCDBBeginsQuestParser } from "../parsers/quest";
import { ClassicDBThumbnailParser, TBCDBThumbnailParser } from "../parsers/thumbnail";
import { UniqueParser } from "../parsers/unique";
import { Item } from "./item";

export class ItemFactory {
    private readonly expansion: Expansion;

    public constructor(expansion: Expansion) {
        this.expansion = expansion;
    }

    public from_page_source(page_source: string): Item {
        if (this.expansion === Expansion.TBC) {
            return this.from_tbcdb_page_source(page_source);
        }
        return this.from_classicdb_page_source(page_source);
    }

    private from_classicdb_page_source(page_source: string): Item {
        const armor = new ArmorValueParser(page_source).parse();
        const attributes = new AttributeParser(page_source).parse();
        const binding = new BindingParser(page_source).parse();
        const block_value = new BlockValueParser(page_source).parse();
        const class_restrictions = new ClassicDBClassParser(page_source).parse();
        const durability = new DurabilityParser(page_source).parse();
        const expansion = Expansion.CLASSIC;
        const flavor_text = new FlavorTextParser(page_source).parse();
        const level_requirement = new LevelRequirementParser(page_source).parse();
        const name = new ClassicDBNameParser(page_source).parse();
        const quality = new QualityParser(page_source).parse();
        const quest = new ClassicDBBeginsQuestParser(page_source).parse();
        const slottype = new SlotTypeParser(page_source).parse();
        const slot = slottype.slot;
        const type = slottype.type;
        const thumbnail = new ClassicDBThumbnailParser(page_source).parse();
        const uniquely_equipped = new UniqueParser(page_source).parse();
        const damage = new WeaponDamageParser(page_source).parse();

        return new Item(
            armor,
            attributes,
            binding,
            block_value,
            class_restrictions,
            durability,
            expansion,
            flavor_text,
            level_requirement,
            name,
            quality,
            quest,
            slot,
            type,
            thumbnail,
            uniquely_equipped,
            damage
        );
    }

    private from_tbcdb_page_source(page_source: string): Item {
        const armor = new ArmorValueParser(page_source).parse();
        const attributes = new AttributeParser(page_source).parse();
        const binding = new BindingParser(page_source).parse();
        const block_value = new BlockValueParser(page_source).parse();
        const class_restrictions = new TBCDBClassParser(page_source).parse();
        const durability = new DurabilityParser(page_source).parse();
        const expansion = Expansion.CLASSIC;
        const flavor_text = new FlavorTextParser(page_source).parse();
        const level_requirement = new LevelRequirementParser(page_source).parse();
        const name = new TBCDBNameParser(page_source).parse();
        const quality = new QualityParser(page_source).parse();
        const quest = new TBCDBBeginsQuestParser(page_source).parse();
        const slottype = new SlotTypeParser(page_source).parse();
        const slot = slottype.slot;
        const type = slottype.type;
        const thumbnail = new TBCDBThumbnailParser(page_source).parse();
        const uniquely_equipped = new UniqueParser(page_source).parse();
        const damage = new WeaponDamageParser(page_source).parse();

        return new Item(
            armor,
            attributes,
            binding,
            block_value,
            class_restrictions,
            durability,
            expansion,
            flavor_text,
            level_requirement,
            name,
            quality,
            quest,
            slot,
            type,
            thumbnail,
            uniquely_equipped,
            damage
        );
    }
}
