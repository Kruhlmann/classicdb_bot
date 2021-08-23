import { Op } from "sequelize";

import { IPostgresDatabaseConnection, PostgresDatabaseConnection } from "./database";
import { ExpansionLookupTable } from "./expansion";
import { IItem } from "./item";
import { ItemFactory } from "./item/factory";
import { ILoggable } from "./logging";
import { ItemQuery, ItemQueryType } from "./message/query_extractor";
import { DatabaseModelBuilder } from "./models";
import { AttributeStatModel } from "./models/attributes";
import { ItemBindingModel } from "./models/binding";
import { ClassModel } from "./models/class";
import { DamageTypeModel } from "./models/damage_type";
import { DiscordGuildModel } from "./models/discord_guild";
import { DiscordGuildConfigurationModel } from "./models/discord_guild_configuration";
import { ExpansionModel } from "./models/expansion";
import { FactionModel } from "./models/faction";
import { ItemModel } from "./models/item";
import { ItemQueryModel } from "./models/item_query";
import { PVPRankModel } from "./models/pvp_rank";
import { ItemQualityModel } from "./models/quality";
import { ReputationLevelModel } from "./models/reputation_level";
import { ReputationRequirementModel as ReputationRequirementModel } from "./models/reputation_requirement";
import { SkillModel } from "./models/skill";
import { SkillRequirementModel } from "./models/skill_requirement";
import { ItemSlotModel } from "./models/slot";
import { SpellModel } from "./models/spell";
import { ItemTypeModel } from "./models/type";
import { WeaponDamageModel } from "./models/weapon_damage";
import { WeaponDamageRangeModel } from "./models/weapon_damage_range";
import { AttributeLookupTable } from "./parsers/attributes";
import { BindingLookupTable } from "./parsers/binding";
import { ClassLookupTable } from "./parsers/class";
import { DamageTypeLookupTable } from "./parsers/damage_type";
import { ItemQualityLookupTable } from "./parsers/quality";
import { PVPRankLookupTable } from "./parsers/rank";
import { ReputationStateLookupTable } from "./parsers/reputation";
import { SlotLookupTable, TypeLookupTable } from "./parsers/slot_type";
import { timeout_after } from "./timeout";

export interface IExternalItemStorage {
    lookup(key: string): Promise<IItem | void>;
    store_item(item: IItem): Promise<ItemModel>;
    initialize(): Promise<void>;
    get_cached_item(search_term: string): Promise<IItem | void>;
}

abstract class PostgreSQLExternalItemStorage implements IExternalItemStorage {
    protected readonly item_model_selector_inclusions = [
        ExpansionModel,
        ItemSlotModel,
        ItemTypeModel,
        ItemBindingModel,
        ItemQualityModel,
        ItemSlotModel,
        PVPRankModel,
        {
            model: WeaponDamageModel,
            include: [
                {
                    model: WeaponDamageRangeModel,
                    include: [DamageTypeModel],
                },
            ],
        },
        {
            model: ReputationRequirementModel,
            include: [ReputationLevelModel, FactionModel],
        },
        {
            model: SkillRequirementModel,
            include: [SkillModel],
        },
        {
            model: AttributeStatModel,
            as: "attributes",
        },
        {
            model: ClassModel,
            as: "class_restrictions",
        },
        {
            model: SpellModel,
            as: "spells",
        },
    ];
    protected readonly database_connection: IPostgresDatabaseConnection;
    protected readonly logger: ILoggable;
    protected readonly model_initializer: DatabaseModelBuilder;
    protected readonly models = [
        ExpansionModel,
        DiscordGuildModel,
        DiscordGuildConfigurationModel,
        ItemModel,
        ItemQueryModel,
        AttributeStatModel,
        ItemBindingModel,
        ClassModel,
        ItemQualityModel,
        ItemSlotModel,
        ItemTypeModel,
        WeaponDamageModel,
        WeaponDamageRangeModel,
        DamageTypeModel,
        ReputationRequirementModel,
        ReputationLevelModel,
        FactionModel,
        SkillModel,
        SkillRequirementModel,
        PVPRankModel,
        SpellModel,
    ];

    public constructor(
        logger: ILoggable,
        username: string,
        password: string,
        database_name: string,
        host = "localhost",
        port = 5432,
    ) {
        this.logger = logger;
        this.logger.log(`Connection to db ${username}:${password.replace(/./g, "*")}@${host}:${port}/${database_name}`);
        this.database_connection = new PostgresDatabaseConnection(username, password, database_name, host, port);
        this.model_initializer = new DatabaseModelBuilder(this.database_connection.database, logger);
    }

    public async get_cached_item(search_term: string): Promise<IItem | void> {
        const model = await ItemModel.findOne({
            where: {
                [Op.or]: [
                    { name: { [Op.like]: "%" + search_term + "%" } },
                    { item_id: Number.parseInt(search_term, 10) || -1 },
                ],
            },
            include: this.item_model_selector_inclusions,
        });
        if (model !== null) {
            return ItemFactory.from_model(model);
        }
    }

    private async store_weapon_damage_for_item(item: IItem): Promise<WeaponDamageModel> {
        const damage_type_lookup_table = new DamageTypeLookupTable();
        const damage_range_promises = item.damage.damage_ranges.map(async (range) => {
            const damage_type_string = damage_type_lookup_table.perform_reverse_lookup(range.type);
            const damage_type = await DamageTypeModel.findOne({ where: { name: damage_type_string } });
            return {
                low: range.low,
                high: range.high,
                damage_type_id: damage_type.id,
            };
        });
        const damage_ranges = await Promise.all(damage_range_promises);
        return WeaponDamageModel.create(
            {
                dps: item.damage.dps,
                speed: item.damage.speed,
                weapon_damage_ranges: damage_ranges,
            },
            { include: WeaponDamageRangeModel },
        );
    }

    private async store_reputation_requirement_for_item(item: IItem): Promise<ReputationRequirementModel> {
        const reputation_level_string = new ReputationStateLookupTable().perform_reverse_lookup(
            item.reputation_requirement.state,
        );
        const reputation_level = await ReputationLevelModel.findOne({ where: { name: reputation_level_string } });
        const faction = await FactionModel.findOrCreate({ where: { name: item.reputation_requirement.name } }).then(
            ([created_or_found_faction, _]) => created_or_found_faction,
        );
        return ReputationRequirementModel.create({ reputation_level_id: reputation_level.id, faction_id: faction.id });
    }

    @timeout_after(2000)
    public async store_item(item: IItem): Promise<ItemModel> {
        const lookup_table = new ExpansionLookupTable();
        const expansion_identifier = lookup_table.perform_reverse_lookup(item.expansion);
        const expansion_model = await ExpansionModel.findOne({ where: { string_identifier: expansion_identifier } });

        const missing = await this.is_item_missing_from_external_storage(item, expansion_model.id);
        if (missing) {
            return this.store_missing_item(item).then((model) => {
                this.logger.debug(`Stored missing item ${item.name}`);
                return model;
            });
        }
        return ItemModel.findOne({ where: { name: item.name, expansion_id: expansion_model.id } }).catch((error) => {
            this.logger.error(`Unable to find item with name ${item.name} and expansion ${expansion_model.id}`);
            throw error;
        });
    }

    private async is_item_missing_from_external_storage(item: IItem, expansion_id: string): Promise<boolean> {
        const item_found = await ItemModel.findOne({
            where: {
                name: item.name,
                expansion_id,
            },
        });
        return !!item_found;
    }

    private async store_missing_item(item: IItem): Promise<ItemModel> {
        const attribute_lookup_table = new AttributeLookupTable();
        const class_lookup_table = new ClassLookupTable();
        const expansion_lookup_table = new ExpansionLookupTable();
        const item_quality_lookup_table = new ItemQualityLookupTable();
        const slot_lookup_table = new SlotLookupTable();
        const type_lookup_table = new TypeLookupTable();

        const expansion_string = expansion_lookup_table.perform_reverse_lookup(item.expansion);
        const expansion = await ExpansionModel.findOne({ where: { string_identifier: expansion_string } });
        const quality_string = item_quality_lookup_table.perform_reverse_lookup(item.quality);
        const quality = await ItemQualityModel.findOne({ where: { name: quality_string } });
        const type_string = type_lookup_table.perform_reverse_lookup(item.type);
        const type = await ItemTypeModel.findOne({ where: { name: type_string } });
        const slot_string = slot_lookup_table.perform_reverse_lookup(item.slot);
        const slot = await ItemSlotModel.findOne({ where: { name: slot_string } });
        const database_attributes = item.attributes.map((attribute) => {
            const string_type = attribute_lookup_table.perform_reverse_lookup(attribute.type);
            return { type: string_type, value: attribute.value };
        });
        const database_class_restrictions = item.class_restrictions.map((class_restriction) => {
            const class_name = class_lookup_table.perform_reverse_lookup(class_restriction);
            return { name: class_name };
        });
        const binding_string = new BindingLookupTable().perform_reverse_lookup(item.binding);
        const binding = await ItemBindingModel.findOne({ where: { type: binding_string } });
        const weapon_damage = await this.store_weapon_damage_for_item(item);
        const reputation_requirement = await this.store_reputation_requirement_for_item(item);
        const skill_requirement = await SkillRequirementModel.store_for_item(item);
        const pvp_rank_string = new PVPRankLookupTable().perform_reverse_lookup(item.rank_requirement);
        const pvp_rank_requirement = await PVPRankModel.findOne({ where: { name: pvp_rank_string } });
        const database_spells = item.spells.map((spell) => {
            return {
                spell_id: spell.id,
                name: spell.name,
                description: spell.description,
                url: spell.url,
                thumbnail_url: spell.thumbnail_url,
                cast_time: spell.cast_time,
                range: spell.range,
                trigger: spell.trigger,
            };
        });

        return ItemModel.create(
            {
                item_id: item.id,
                armor: item.armor,
                attributes: database_attributes,
                class_restrictions: database_class_restrictions,
                binding_id: binding.id,
                block_value: item.block_value,
                durability: item.durability,
                flavor_text: item.flavor_text,
                level_requirement: item.level_requirement,
                starts_quest: item.starts_quest,
                is_quest_item: item.is_quest_item,
                name: item.name,
                thumbnail: item.thumbnail,
                uniquely_equipped: item.uniquely_equipped,
                url: item.url,
                spells: database_spells,
                expansion_id: expansion.id,
                quality_id: quality.id,
                slot_id: slot.id,
                type_id: type.id,
                weapon_damage_id: weapon_damage.id,
                reputation_requirement_id: reputation_requirement.id,
                skill_requirement_id: skill_requirement.id,
                pvp_rank_id: pvp_rank_requirement.id,
            },
            {
                include: [
                    {
                        model: AttributeStatModel,
                        as: "attributes",
                    },
                    {
                        model: ClassModel,
                        as: "class_restrictions",
                    },
                    {
                        model: SpellModel,
                        as: "spells",
                    },
                ],
            },
        );
    }

    public async lookup(key: string): Promise<IItem | void> {
        return ItemModel.findByPk(key, { include: [ExpansionModel] }).then((item?: unknown) => {
            if (item) {
                return item as IItem;
            }
        });
    }

    public abstract initialize(): Promise<void>;
}

export class TemporalPostgreSQLExternalItemStorage extends PostgreSQLExternalItemStorage {
    public async initialize(): Promise<void> {
        await this.model_initializer.initialize(this.models, true);
    }
}

export class PersistentPostgreSQLExternalItemStorage extends PostgreSQLExternalItemStorage {
    public async initialize(): Promise<void> {
        await this.model_initializer.initialize(this.models, false);
    }
}
