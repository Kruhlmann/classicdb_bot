import * as fs from "fs";
import { Op } from "sequelize";

import { IPostgresDatabaseConnection, PostgresDatabaseConnection } from "./database";
import { ExpansionLookupTable } from "./expansion";
import { IItem, Item } from "./item";
import { ILoggable } from "./logging";
import { ItemQuery, ItemQueryType } from "./message/query_extractor";
import { DatabaseModelBuilder } from "./models";
import { AttributeStatModel } from "./models/attributes";
import { DiscordGuildModel } from "./models/discord_guild";
import { DiscordGuildConfigurationModel } from "./models/discord_guild_configuration";
import { ExpansionModel } from "./models/expansion";
import { ItemModel } from "./models/item";
import { ItemQueryModel } from "./models/item_query";
import { timeout_after } from "./timeout";
import { AttributeLookupTable } from "./parsers/attributes";

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
                {
                    model: AttributeStatModel,
                    as: "attributes",
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
                {
                    model: AttributeStatModel,
                    as: "attributes",
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

    private async store_missing_item(item: IItem) {
        const expansion_string = new ExpansionLookupTable().perform_reverse_lookup(item.expansion);
        const expansion = await ExpansionModel.findOne({ where: { string_identifier: expansion_string } });
        const attribute_lookup_table = new AttributeLookupTable();
        const database_attributes = item.attributes.map((attribute) => {
            const string_type = attribute_lookup_table.perform_reverse_lookup(attribute.type);
            return { type: string_type, value: attribute.value };
        });
        await ItemModel.create(
            {
                item_id: item.id,
                armor: item.armor,
                attributes: database_attributes,
                block_value: item.block_value,
                durability: item.durability,
                flavor_text: item.flavor_text,
                level_requirement: item.level_requirement,
                name: item.name,
                thumbnail: item.thumbnail,
                uniquely_equipped: item.uniquely_equipped,
                url: item.url,
                expansion_id: expansion.id,
            },
            {
                include: {
                    model: AttributeStatModel,
                    as: "attributes",
                },
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
