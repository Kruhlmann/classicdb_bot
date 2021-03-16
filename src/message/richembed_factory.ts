import { Item } from "../item";
import { RichEmbed } from "discord.js";
import { EquipmentStringFactory } from "./string_factories/equipment";
import { ItemBindingStringFactory } from "./string_factories/binding";
import { UniqueStringFactory } from "./string_factories/unique";
import { DamageStringFactory } from "./string_factories/weapon_damage";
import { AttributeStringFactory } from "./string_factories/attributes";
import { ArmorStringFactory } from "./string_factories/armor";
import { DurabilityStringFactory } from "./string_factories/durability";
import { ClassRestrictionStringFactory } from "./string_factories/class";
import { LevelRequirementStringFactory } from "./string_factories/level";
import { BlockValueStringFactory } from "./string_factories/block";
import { FlavorTextStringFactory } from "./string_factories/flavor_text";
import { ReputationRequirementStringFactory } from "./string_factories/reputation";
import { SkillRequirementStringFactory } from "./string_factories/skill";
import { PVPRankRequirementStringFactory } from "./string_factories/rank";
import { ItemQualityColorLookupTable } from "../parsers/quality";
import { ILookupTable } from "../lookup_table";

export interface IRichEmbedDescriptionFactory {
    build_richembed_description_from_item(item: Item): string;
}

export interface IRichEmbedFactory {
    make_richembed_from_item(item: Item): RichEmbed;
}

class RichEmbedDescriptionFactory {
    public build_richembed_description_from_item(item: Item): string {
        const binding_str = new ItemBindingStringFactory(item).build();
        const unique_str = new UniqueStringFactory(item).build();
        const equipment_str = new EquipmentStringFactory(item).build();
        const damage_str = new DamageStringFactory(item).build();
        const armor_str = new ArmorStringFactory(item).build();
        const block_str = new BlockValueStringFactory(item).build();
        const attribute_str = new AttributeStringFactory(item).build();
        const durability_str = new DurabilityStringFactory(item).build();
        const class_restriction_str = new ClassRestrictionStringFactory(item).build();
        const level_requirement_str = new LevelRequirementStringFactory(item).build();
        const rank_requirement_str = new PVPRankRequirementStringFactory(item).build();
        const skill_requirement_str = new SkillRequirementStringFactory(item).build();
        const reputation_requirement_str = new ReputationRequirementStringFactory(item).build();
        const flavor_text_str = new FlavorTextStringFactory(item).build();
        //const dmg_formatted = format_damage(item);
        //const stats_formatted = format_stats(item);
        //const durability_formatted = format_durability(item);
        //const class_restrictions = format_class_restrictions(item);
        //const level_requirement_formatted = format_level_requirement(item);
        //const effects_short_formatted = format_effects(item);

        //return `${item.binds_on ? `${item.binds_on}\n` : ""}`
        //+ `${item.unique ? "Unique\n" :  ""}`
        //+ `${item.begins_quest ? `${item.begins_quest.to_md()}\n` : ""}`
        //+ `${equipment_formatted}`
        //+ `${dmg_formatted}`
        //+ `${item.armor ? `${item.armor} Armor\n` : ""}`
        //+ `${item.block ? `${item.block} Block\n` : ""}`
        //+ `${stats_formatted}`
        //+ `${durability_formatted}`
        //+ `${class_restrictions}`
        //+ `${level_requirement_formatted}`
        //+ `${effects_short_formatted}`.trim();
        return [
            binding_str,
            unique_str,
            equipment_str,
            damage_str,
            armor_str,
            block_str,
            attribute_str,
            durability_str,
            class_restriction_str,
            level_requirement_str,
            rank_requirement_str,
            skill_requirement_str,
            reputation_requirement_str,
            flavor_text_str,
        ]
            .filter((line) => line !== "")
            .join("\n");
    }
}

export class RichEmbedFactory {
    private readonly favicon_path: string;
    private readonly discord_invite_url: string;
    private readonly discord_icon_url: string;
    private readonly richembed_description_factory: IRichEmbedDescriptionFactory;
    private readonly item_quality_color_lookup_table: ILookupTable<string>;

    public constructor(favicon_path: string, discord_invite_url: string, discord_icon_url: string) {
        this.favicon_path = favicon_path;
        this.discord_invite_url = discord_invite_url;
        this.discord_icon_url = discord_icon_url;
        this.richembed_description_factory = new RichEmbedDescriptionFactory();
        this.item_quality_color_lookup_table = new ItemQualityColorLookupTable();
    }

    public make_richembed_from_item(item: Item): RichEmbed {
        const description = this.richembed_description_factory.build_richembed_description_from_item(item);
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
