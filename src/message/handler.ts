import { Guild } from "discord.js";

import { Expansion } from "../expansion";
import { IExternalItemStorage } from "../external_item_storage";
import { IItem, Item } from "../item";
import { ItemQueryProcessor } from "../item/processor";
import { ILoggable } from "../logging";
import { DiscordGuildModel } from "../models/discord_guild";
import { DiscordGuildConfigurationModel } from "../models/discord_guild_configuration";
import { ExpansionModel } from "../models/expansion";
import { ItemModel } from "../models/item";
import { ItemQueryModel } from "../models/item_query";
import { timeout_after } from "../timeout";
import { ClassicDB, IWowHead, TBCDB } from "../wowhead";
import { Message } from ".";
import { ItemQuery } from "./query_extractor";
import {
    IRichEmbedItemFactory,
    IRichEmbedSpellFactory,
    RichEmbedItemFactory,
    RichEmbedSpellFactory,
} from "./richembed_factory";

export interface IMessageHandler {
    item_query_to_item(item_query: ItemQuery): Promise<Item>;
    act_on_message(message: Message): Promise<void>;
}

export class MessageHandler implements IMessageHandler {
    private readonly classic_wowhead: IWowHead;
    private readonly tbc_wowhead: IWowHead;
    private readonly richembed_item_factory: IRichEmbedItemFactory;
    private readonly richembed_spell_factory: IRichEmbedSpellFactory;
    private readonly external_item_storage: IExternalItemStorage;
    private readonly logger: ILoggable;

    public constructor(external_item_storage: IExternalItemStorage, logger: ILoggable) {
        this.classic_wowhead = new ClassicDB("https://classicdb.ch");
        this.tbc_wowhead = new TBCDB("https://tbcdb.com");
        this.richembed_item_factory = new RichEmbedItemFactory(
            "https://images-ext-1.discordapp.net/external/s8uTI5co6Kys0_gnCCuzQOPsc5cAkoqivBFSpH5wnv8/https/orig08.deviantart.net/65e3/f/2014/207/e/2/official_wow_icon_by_benashvili-d7sd1ab.png",
            "https://discord.gg/mRUEPnp",
            "https://images-ext-2.discordapp.net/external/qwilFmqqSub3IKzUz47jRtBSMIR2RQVA8tjqxRHfavk/https/discordapp.com/assets/28174a34e77bb5e5310ced9f95cb480b.png",
        );
        this.richembed_spell_factory = new RichEmbedSpellFactory();
        this.external_item_storage = external_item_storage;
        this.logger = logger;
    }

    private async get_all_item_queries_from_message(message: Message): Promise<ItemQuery[]> {
        const default_expansion = await DiscordGuildModel.get_default_expansion(
            message.original_message.guild.id,
        ).catch((error) => {
            this.logger.error(`Error getting default expansion for guild ${message.original_message.guild.id}`);
            throw error;
        });
        return ItemQueryProcessor.get_all_item_queries_from_message(message, default_expansion);
    }

    public async item_query_to_item(item_query: ItemQuery): Promise<IItem> {
        const cached_item = await this.external_item_storage.get_cached_item(item_query.query);
        return cached_item || this.build_item_from_wowhead_source(item_query);
    }

    private async build_item_from_wowhead_source(item_query: ItemQuery): Promise<IItem> {
        if (item_query.expansion === Expansion.CLASSIC) {
            return this.classic_wowhead.search(item_query.query);
        }
        return this.tbc_wowhead.search(item_query.query);
    }

    private async store_item_query(item_id: string, discord_guild_id: string): Promise<void> {
        const guild = await DiscordGuildModel.findOne({ where: { guild_id: discord_guild_id } });
        await ItemQueryModel.create({
            item_id,
            guild_id: guild.id,
        }).catch((error) => {
            this.logger.error("Error while storing item query model");
            throw error;
        });
    }

    private async act_on_item_query_if_item_is_defined(item_query: ItemQuery, message: Message): Promise<void> {
        const item = await this.item_query_to_item(item_query).catch((error) => {
            this.logger.error(`Error while converting item query to item ${JSON.stringify(item_query)}`);
            throw error;
        });
        if (item.id !== undefined) {
            const item_model = await this.act_on_item_query(item, message);
            await this.store_item_query(item_model.id, message.original_message.guild.id).catch((error) => {
                this.logger.error(`Error while storing item query ${JSON.stringify(item_query)}`);
                throw error;
            });
        }
    }

    private async act_on_item_query(item: Item, message: Message): Promise<ItemModel> {
        const item_model = await this.external_item_storage.store_item(item).catch((error) => {
            this.logger.error("Error while storing item");
            throw error;
        });
        const item_richembed = this.richembed_item_factory.make_richembed_from_item(item);
        const spell_richembeds = this.richembed_spell_factory.make_richembeds_from_item(item);
        for (const richembed of [item_richembed, ...spell_richembeds]) {
            message.channel.send(richembed).catch((error) => {
                this.logger.error("Error while sending message");
                throw error;
            });
        }
        return item_model;
    }

    public async act_on_message(message: Message): Promise<void> {
        await this.update_discord_guild(message.original_message.guild);
        const action_promises = await this.get_actions_from_message(message);
        await Promise.all(action_promises).catch((error) => {
            this.logger.error("Error during message action execution");
            throw error;
        });
    }

    private async get_actions_from_message(message: Message): Promise<Promise<void>[]> {
        const item_queries = await this.get_all_item_queries_from_message(message).catch((error) => {
            this.logger.error("Error extracting queries from message ${message.content}");
            throw error;
        });
        return item_queries.map(async (item_query) => {
            try {
                return this.act_on_item_query_if_item_is_defined(item_query, message);
            } catch (error) {
                this.logger.error(`Error while acting on item query ${JSON.stringify(item_query)}`);
                throw error;
            }
        });
    }

    @timeout_after(2000)
    private async update_discord_guild(guild: Guild): Promise<void> {
        try {
            await this.create_discord_guild_if_missing(guild);
            await this.create_discord_guild_configuration_if_missing(guild);
        } catch (error) {
            this.logger.debug(error);
            this.logger.error("Unable to update guild");
        }
    }

    private async create_discord_guild_if_missing(guild: Guild): Promise<void> {
        const number_of_guilds_with_id = await DiscordGuildModel.count({ where: { guild_id: guild.id } });
        if (number_of_guilds_with_id === 0) {
            await this.create_discord_guild(guild).catch((error) => {
                this.logger.error("Error while creating discord guild");
                throw error;
            });
        }
    }

    private async create_discord_guild_configuration_if_missing(guild: Guild): Promise<void> {
        const number_of_guilds_configs_for_guild = await DiscordGuildConfigurationModel.count();
        if (number_of_guilds_configs_for_guild === 0) {
            await this.create_discord_guild_configuration(guild).catch((error) => {
                this.logger.error("Error while creating discord guild configuration");
                throw error;
            });
        }
    }

    private async create_discord_guild_configuration(guild: Guild): Promise<void> {
        const assoc_guild = await DiscordGuildModel.findOne({ where: { guild_id: guild.id } });
        const assoc_expansion = await ExpansionModel.findOne({ where: { string_identifier: "tbc" } });
        await DiscordGuildConfigurationModel.create({
            discord_guild_id: assoc_guild.id,
            default_expansion_id: assoc_expansion.id,
        });
        this.logger.log(`Registered new guild config for: ${guild.name} (${guild.id})`);
    }

    private async create_discord_guild(guild: Guild) {
        await DiscordGuildModel.create({ guild_id: guild.id });
        this.logger.log(`Registered new guild: ${guild.name} (${guild.id})`);
    }
}
