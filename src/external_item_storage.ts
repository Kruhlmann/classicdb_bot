import * as fs from "fs";
import { Op } from "sequelize";

import { IPostgresDatabaseConnection, PostgresDatabaseConnection } from "./database";
import { ExpansionLookupTable } from "./expansion";
import { IItem, Item } from "./item";
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
import { ItemModel } from "./models/item";
import { ItemQueryModel } from "./models/item_query";
import { ItemQualityModel } from "./models/quality";
import { ItemSlotModel } from "./models/slot";
import { ItemTypeModel } from "./models/type";
import { WeaponDamageModel } from "./models/weapon_damage";
import { WeaponDamageRangeModel } from "./models/weapon_damage_range";
import { AttributeLookupTable } from "./parsers/attributes";
import { BindingLookupTable } from "./parsers/binding";
import { ClassLookupTable } from "./parsers/class";
import { DamageTypeLookupTable } from "./parsers/damage_type";
import { ItemQualityLookupTable } from "./parsers/quality";
import { SlotLookupTable, TypeLookupTable } from "./parsers/slot_type";
import { timeout_after } from "./timeout";

export interface IExternalItemStorage {
    lookup(key: string): Promise<IItem | void>;
    store_item(item: IItem): Promise<void>;
    initialize(): Promise<void>;
    get_cached_item(item_query: ItemQuery): Promise<IItem | void>;
}

abstract class PostgreSQLExternalItemStorage implements IExternalItemStorage {
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
    ];

    public constructor(
        logger: ILoggable,
        username: string,
        password: string,
        database_name: string,
        host = "localhost",
        port = 5432,
    ) {
        this.database_connection = new PostgresDatabaseConnection(username, password, database_name, host, port);
        this.model_initializer = new DatabaseModelBuilder(this.database_connection.database, logger);
        this.logger = logger;
    }

    @timeout_after(2000)
    public async store_item(item: IItem): Promise<void> {
        if (await this.is_item_missing_from_external_storage(item)) {
            await this.store_missing_item(item);
            this.logger.log(`Stored missing item ${item.name}`);
        }
    }

    private async get_cached_item_from_id(id: number): Promise<IItem | void> {
        const item_model = await ItemModel.findOne({
            where: {
                item_id: id,
            },
            include: [
                ExpansionModel,
                ItemSlotModel,
                ItemTypeModel,
                ItemBindingModel,
                ItemQualityModel,
                ItemSlotModel,
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
                    model: AttributeStatModel,
                    as: "attributes",
                },
                {
                    model: ClassModel,
                    as: "class_restrictions",
                },
            ],
        });
        if (!item_model) {
            return;
        }
        return Item.from_model(item_model);
    }

    private async get_cached_item_from_name_partial(name_partial: string): Promise<IItem | void> {
        const item_model = await ItemModel.findOne({
            where: {
                name: { [Op.like]: "%" + name_partial + "%" },
            },
            include: [
                ExpansionModel,
                ItemSlotModel,
                ItemTypeModel,
                ItemBindingModel,
                ItemQualityModel,
                ItemSlotModel,
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
                    model: AttributeStatModel,
                    as: "attributes",
                },
                {
                    model: ClassModel,
                    as: "class_restrictions",
                },
            ],
        });
        if (!item_model) {
            return;
        }
        return Item.from_model(item_model);
    }

    public async get_cached_item(item_query: ItemQuery): Promise<IItem | void> {
        if (item_query.type === ItemQueryType.ID) {
            const item_query_int = Number.parseInt(item_query.query, 10);
            return this.get_cached_item_from_id(item_query_int);
        }
        return this.get_cached_item_from_name_partial(item_query.query);
    }

    private async is_item_missing_from_external_storage(item: IItem) {
        const lookup_table = new ExpansionLookupTable();
        const item_expansion = lookup_table.perform_reverse_lookup(item.expansion);
        const items_with_name = await ItemModel.findAll({
            where: {
                name: item.name,
            },
            include: [ExpansionModel],
        });
        const items_with_name_and_expansion = items_with_name.filter((item) => {
            return item.expansion.string_identifier === item_expansion;
        });
        return items_with_name_and_expansion.length === 0;
    }

    private async store_weapon_damage_for_item(item: IItem): Promise<WeaponDamageModel> {
        const damage_type_lookup_table = new DamageTypeLookupTable();
        const damage_range_promises = item.damage.damage_ranges.map(async (range) => {
            const damage_type_string = damage_type_lookup_table.perform_reverse_lookup(range.type);
            const damage_type = await DamageTypeModel.findOne({ where: { name: damage_type_string } });
            console.log(`Sending ${damage_type.id} gotten from ${damage_type_string} ${range.type}`);
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

    private async store_missing_item(item: IItem): Promise<void> {
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

        await ItemModel.create(
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
                name: item.name,
                thumbnail: item.thumbnail,
                uniquely_equipped: item.uniquely_equipped,
                url: item.url,
                expansion_id: expansion.id,
                quality_id: quality.id,
                slot_id: slot.id,
                type_id: type.id,
                weapon_damage_id: weapon_damage.id,
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

abstract class JSONExternalItemStorage implements IExternalItemStorage {
    private readonly file_path: string;

    public constructor(file_path: string) {
        this.file_path = file_path;
    }

    private read(): string {
        return fs.readFileSync(this.abs_file_path).toString();
    }

    private read_and_parse(): Record<string, IItem> {
        return JSON.parse(this.read()) as Record<string, IItem>;
    }

    public async get_cached_item(item_query: ItemQuery): Promise<IItem | void> {
        return this.lookup(item_query.query);
    }

    public async lookup(item_name: string): Promise<IItem | void> {
        const file_contents_object = this.read_and_parse();
        if (Object.keys(file_contents_object).includes(item_name)) {
            return file_contents_object[item_name];
        }
    }

    protected write(items: Record<string, IItem>): void {
        fs.writeFileSync(this.abs_file_path, JSON.stringify(items));
    }

    protected get abs_file_path(): string {
        return `${__dirname}/../../${this.file_path}`;
    }

    public async store_item(item: IItem): Promise<void> {
        const file_contents_object = this.read_and_parse();
        file_contents_object[item.name] = item;
        this.write(file_contents_object);
    }

    public abstract initialize(): Promise<void>;
}

export class TemporalJSONExternalItemStorage extends JSONExternalItemStorage {
    public async initialize(): Promise<void> {
        this.write({});
    }
}

export class PermanentJSONExternalItemStorage extends JSONExternalItemStorage {
    public async initialize(): Promise<void> {
        if (!fs.existsSync(this.abs_file_path)) {
            this.write({});
        }
    }
}
