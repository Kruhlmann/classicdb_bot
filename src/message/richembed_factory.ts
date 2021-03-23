import { RichEmbed } from "discord.js";

import { IItem } from "../item";
import { ILookupTable } from "../lookup_table";
import { ItemQuality, ItemQualityColorLookupTable } from "../parsers/quality";
import { ISpell } from "../spell";
import { ArmorStringFactory } from "./string_factories/armor";
import { AttributeStringFactory } from "./string_factories/attributes";
import { ItemBindingStringFactory } from "./string_factories/binding";
import { BlockValueStringFactory } from "./string_factories/block";
import { CastTimeStringFactory } from "./string_factories/cast_time";
import { ClassRestrictionStringFactory } from "./string_factories/class";
import { DurabilityStringFactory } from "./string_factories/durability";
import { EquipmentStringFactory } from "./string_factories/equipment";
import { FlavorTextStringFactory } from "./string_factories/flavor_text";
import { LevelRequirementStringFactory } from "./string_factories/level";
import { RangeStringFactory } from "./string_factories/range";
import { PVPRankRequirementStringFactory } from "./string_factories/rank";
import { ReputationRequirementStringFactory } from "./string_factories/reputation";
import { SpellSummaryTextStringFactory } from "./string_factories/simple_spell";
import { SkillRequirementStringFactory } from "./string_factories/skill";
import { UniqueStringFactory } from "./string_factories/unique";
import { DamageStringFactory } from "./string_factories/weapon_damage";

export interface IRichEmbedItemDescriptionFactory {
    build_richembed_description_from_item(item: IItem): string;
}

export interface IRichEmbedSpellDescriptionFactory {
    build_richembed_description_from_spell(spell: ISpell): string;
}

export interface IRichEmbedItemFactory {
    make_richembed_from_item(item: IItem): RichEmbed;
}

export interface IRichEmbedSpellFactory {
    make_richembeds_from_item(item: { complex_spells: ISpell[] }): RichEmbed[];
}

class RichEmbedItemDescriptionFactory {
    public build_richembed_description_from_item(item: IItem): string {
        const binding_string = new ItemBindingStringFactory(item).build();
        const unique_string = new UniqueStringFactory(item).build();
        const equipment_string = new EquipmentStringFactory(item).build();
        const damage_string = new DamageStringFactory(item).build();
        const armor_string = new ArmorStringFactory(item).build();
        const block_string = new BlockValueStringFactory(item).build();
        const attribute_string = new AttributeStringFactory(item).build();
        const durability_string = new DurabilityStringFactory(item).build();
        const class_restriction_string = new ClassRestrictionStringFactory(item).build();
        const level_requirement_string = new LevelRequirementStringFactory(item).build();
        const rank_requirement_string = new PVPRankRequirementStringFactory(item).build();
        const skill_requirement_string = new SkillRequirementStringFactory(item).build();
        const reputation_requirement_string = new ReputationRequirementStringFactory(item).build();
        const flavor_text_string = new FlavorTextStringFactory(item).build();
        const spell_summary_text_string = new SpellSummaryTextStringFactory(item).build();

        return [
            binding_string,
            unique_string,
            equipment_string,
            damage_string,
            armor_string,
            block_string,
            attribute_string,
            durability_string,
            class_restriction_string,
            level_requirement_string,
            rank_requirement_string,
            skill_requirement_string,
            reputation_requirement_string,
            flavor_text_string,
            spell_summary_text_string,
        ]
            .filter((line) => line !== "")
            .join("\n");
    }
}

export class RichEmbedSpellDescriptionFactory implements IRichEmbedSpellDescriptionFactory {
    public build_richembed_description_from_spell(spell: ISpell): string {
        const range_string = new RangeStringFactory(spell).build();
        const cast_time_string = new CastTimeStringFactory(spell).build();

        return [range_string, cast_time_string, spell.description].filter((line) => line !== "").join("\n");
    }
}

export class RichEmbedSpellFactory implements IRichEmbedSpellFactory {
    private readonly richembed_spell_description_factory: IRichEmbedSpellDescriptionFactory;

    public constructor() {
        this.richembed_spell_description_factory = new RichEmbedSpellDescriptionFactory();
    }

    public make_richembeds_from_item(item: { quality: ItemQuality; complex_spells: ISpell[] }): RichEmbed[] {
        return item.complex_spells.map((spell) => {
            return this.make_richembed_from_spell(spell, item.quality);
        });
    }

    private make_richembed_from_spell(spell: ISpell, quality: ItemQuality): RichEmbed {
        const description = this.richembed_spell_description_factory.build_richembed_description_from_spell(spell);

        return new RichEmbed()
            .setTitle(spell.name)
            .setDescription(description)
            .setColor(new ItemQualityColorLookupTable().perform_lookup(quality))
            .setThumbnail(spell.thumbnail_url)
            .setURL(spell.url);
    }
}

export class RichEmbedItemFactory {
    private readonly favicon_path: string;
    private readonly discord_invite_url: string;
    private readonly discord_icon_url: string;
    private readonly richembed_item_description_factory: IRichEmbedItemDescriptionFactory;
    private readonly item_quality_color_lookup_table: ILookupTable<string>;

    public constructor(favicon_path: string, discord_invite_url: string, discord_icon_url: string) {
        this.favicon_path = favicon_path;
        this.discord_invite_url = discord_invite_url;
        this.discord_icon_url = discord_icon_url;
        this.richembed_item_description_factory = new RichEmbedItemDescriptionFactory();
        this.item_quality_color_lookup_table = new ItemQualityColorLookupTable();
    }

    public make_richembed_from_item(item: IItem): RichEmbed {
        const description = this.richembed_item_description_factory.build_richembed_description_from_item(item);
        const color = this.item_quality_color_lookup_table.perform_lookup(item.quality);
        return new RichEmbed()
            .setTitle(item.name)
            .setColor(color)
            .setDescription(description)
            .setAuthor("ClassicDB Bot", this.favicon_path, this.discord_invite_url)
            .setThumbnail(item.thumbnail)
            .setFooter(this.discord_invite_url, this.discord_icon_url)
            .setURL(item.url);
    }
}
