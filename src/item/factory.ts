import { Expansion } from "../expansion";
import { AttributeStatModel } from "../models/attributes";
import { ItemBindingModel } from "../models/binding";
import { ClassModel } from "../models/class";
import { ExpansionModel } from "../models/expansion";
import { ItemModel } from "../models/item";
import { PVPRankModel } from "../models/pvp_rank";
import { ItemQualityModel } from "../models/quality";
import { ReputationRequirementModel } from "../models/reputation_requirement";
import { SkillRequirementModel } from "../models/skill_requirement";
import { ItemSlotModel } from "../models/slot";
import { SpellModel } from "../models/spell";
import { ItemTypeModel } from "../models/type";
import { WeaponDamageModel } from "../models/weapon_damage";
import { ArmorValueParser } from "../parsers/armor";
import { AttributeParser } from "../parsers/attributes";
import { BindingParser } from "../parsers/binding";
import { BlockValueParser } from "../parsers/block_value";
import { ClassicDBClassParser, TBCDBClassParser } from "../parsers/class";
import { DurabilityParser } from "../parsers/durability";
import { FlavorTextParser } from "../parsers/flavor_text";
import { LevelRequirementParser } from "../parsers/level";
import { ClassicDBNameParser, TBCDBNameParser } from "../parsers/name";
import { QualityParser } from "../parsers/quality";
import { ClassicDBBeginsQuestParser, IsPartOfQuestParser, TBCDBBeginsQuestParser } from "../parsers/quest";
import { PVPRankRequirementParser } from "../parsers/rank";
import { ReputationRequirementParser } from "../parsers/reputation";
import { SkillRequirementParser } from "../parsers/skill";
import { SlotTypeParser } from "../parsers/slot_type";
import { ClassicDBThumbnailParser, TBCDBThumbnailParser } from "../parsers/thumbnail";
import { UniqueParser } from "../parsers/unique";
import { WeaponDamageParser } from "../parsers/weapon_damage";
import { ClassicDBSpellFactory, TBCDBSpellFactory } from "../spell/factory";
import { IItem, Item } from ".";

export interface IItemFactory {
    from_page_source(page_source: string, page_url: string, item_id: number): Promise<IItem>;
}

export class ItemFactory implements IItemFactory {
    private readonly expansion: Expansion;

    public constructor(expansion: Expansion) {
        this.expansion = expansion;
    }

    public async from_page_source(page_source: string, page_url: string, item_id: number): Promise<IItem> {
        if (this.expansion === Expansion.TBC) {
            return this.from_tbcdb_page_source(page_source, page_url, item_id);
        }
        return this.from_classicdb_page_source(page_source, page_url, item_id);
    }

    private async from_classicdb_page_source(page_source: string, page_url: string, item_id: number): Promise<IItem> {
        const armor = new ArmorValueParser(page_source).parse();
        const attributes = new AttributeParser(page_source).parse();
        const binding = new BindingParser(page_source).parse();
        const block_value = new BlockValueParser(page_source).parse();
        const class_restrictions = new ClassicDBClassParser(page_source).parse();
        const durability = new DurabilityParser(page_source).parse();
        const flavor_text = new FlavorTextParser(page_source).parse();
        const is_quest_item = new IsPartOfQuestParser(page_source).parse();
        const level_requirement = new LevelRequirementParser(page_source).parse();
        const rank_requirement = new PVPRankRequirementParser(page_source).parse();
        const skill_requirement = new SkillRequirementParser(page_source).parse();
        const reputation_requirement = new ReputationRequirementParser(page_source).parse();

        const name = new ClassicDBNameParser(page_source).parse();
        const quality = new QualityParser(page_source).parse();
        const quest = new ClassicDBBeginsQuestParser(page_source).parse();
        const slottype = new SlotTypeParser(page_source).parse();
        const slot = slottype.slot;
        const type = slottype.type;
        const thumbnail = new ClassicDBThumbnailParser(page_source).parse();
        const uniquely_equipped = new UniqueParser(page_source).parse();
        const damage = new WeaponDamageParser(page_source).parse();
        const spells = await new ClassicDBSpellFactory().from_item_page_source(page_source);

        return new Item(
            item_id,
            armor,
            attributes,
            binding,
            block_value,
            class_restrictions,
            durability,
            this.expansion,
            flavor_text,
            level_requirement,
            is_quest_item,
            name,
            quality,
            quest,
            slot,
            type,
            thumbnail,
            uniquely_equipped,
            damage,
            reputation_requirement,
            skill_requirement,
            rank_requirement,
            page_url,
            spells,
        );
    }

    private async from_tbcdb_page_source(page_source: string, page_url: string, item_id: number): Promise<IItem> {
        const armor = new ArmorValueParser(page_source).parse();
        const attributes = new AttributeParser(page_source).parse();
        const binding = new BindingParser(page_source).parse();
        const block_value = new BlockValueParser(page_source).parse();
        const class_restrictions = new TBCDBClassParser(page_source).parse();
        const durability = new DurabilityParser(page_source).parse();
        const flavor_text = new FlavorTextParser(page_source).parse();
        const is_quest_item = new IsPartOfQuestParser(page_source).parse();
        const level_requirement = new LevelRequirementParser(page_source).parse();
        const rank_requirement = new PVPRankRequirementParser(page_source).parse();
        const skill_requirement = new SkillRequirementParser(page_source).parse();
        const reputation_requirement = new ReputationRequirementParser(page_source).parse();
        const name = new TBCDBNameParser(page_source).parse();
        const quality = new QualityParser(page_source).parse();
        const quest = new TBCDBBeginsQuestParser(page_source).parse();
        const slottype = new SlotTypeParser(page_source).parse();
        const slot = slottype.slot;
        const type = slottype.type;
        const thumbnail = new TBCDBThumbnailParser(page_source).parse();
        const uniquely_equipped = new UniqueParser(page_source).parse();
        const damage = new WeaponDamageParser(page_source).parse();
        const spells = await new TBCDBSpellFactory().from_item_page_source(page_source);

        return new Item(
            item_id,
            armor,
            attributes,
            binding,
            block_value,
            class_restrictions,
            durability,
            this.expansion,
            flavor_text,
            level_requirement,
            is_quest_item,
            name,
            quality,
            quest,
            slot,
            type,
            thumbnail,
            uniquely_equipped,
            damage,
            reputation_requirement,
            skill_requirement,
            rank_requirement,
            page_url,
            spells,
        );
    }

    public static from_model(model: ItemModel): IItem {
        const expansion = ExpansionModel.to_expansion(model.expansion);
        return new Item(
            model.item_id,
            model.armor,
            model.attributes.map((model) => AttributeStatModel.to_attribute_stat(model)),
            ItemBindingModel.to_item_binding(model.binding),
            model.block_value,
            model.class_restrictions.map((model) => ClassModel.to_class(model)),
            model.durability,
            expansion,
            model.flavor_text,
            model.level_requirement,
            model.is_quest_item,
            model.name,
            ItemQualityModel.to_item_quality(model.quality),
            model.starts_quest,
            ItemSlotModel.to_item_slot(model.item_slot),
            ItemTypeModel.to_item_type(model.item_type),
            model.thumbnail,
            model.uniquely_equipped,
            WeaponDamageModel.to_weapon_damage(model.weapon_damage),
            ReputationRequirementModel.to_reputation_requirement(model.reputation_requirement),
            SkillRequirementModel.to_skill_requirement(model.skill_requirement),
            PVPRankModel.to_pvp_rank(model.pvp_rank),
            model.url,
            model.spells.map((spell) => SpellModel.to_spell(spell, expansion)),
        );
    }
}
