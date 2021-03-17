import { Expansion } from "../expansion";
import { IExternalItemStorage } from "../external_item_storage";
import { Item } from "../item";
import { ItemQueryProcessor } from "../item/processor";
import { ClassicDB, IWowHead, TBCDB } from "../wowhead";
import { Message } from ".";
import { ItemQuery } from "./query_extractor";
import { IRichEmbedFactory, RichEmbedFactory } from "./richembed_factory";

export interface IMessageHandler {
    item_query_to_item(item_query: ItemQuery): Promise<Item>;
    act_on_message(message: Message): Promise<void[]>;
}

export class MessageHandler implements IMessageHandler {
    private readonly classic_wowhead: IWowHead;
    private readonly tbc_wowhead: IWowHead;
    private readonly richembed_factory: IRichEmbedFactory;
    private readonly external_item_storage?: IExternalItemStorage;

    public constructor(external_item_storage: IExternalItemStorage) {
        this.classic_wowhead = new ClassicDB("https://classicdb.ch");
        this.tbc_wowhead = new TBCDB("https://tbcdb.com");
        this.richembed_factory = new RichEmbedFactory(
            "https://images-ext-1.discordapp.net/external/s8uTI5co6Kys0_gnCCuzQOPsc5cAkoqivBFSpH5wnv8/https/orig08.deviantart.net/65e3/f/2014/207/e/2/official_wow_icon_by_benashvili-d7sd1ab.png",
            "https://discord.gg/mRUEPnp",
            "https://images-ext-2.discordapp.net/external/qwilFmqqSub3IKzUz47jRtBSMIR2RQVA8tjqxRHfavk/https/discordapp.com/assets/28174a34e77bb5e5310ced9f95cb480b.png",
        );
        this.external_item_storage = external_item_storage;
    }

    private get_all_item_queries_from_message(message: Message): ItemQuery[] {
        return ItemQueryProcessor.get_all_item_queries_from_message(message, Expansion.CLASSIC);
    }

    public async item_query_to_item(item_query: ItemQuery): Promise<Item> {
        if (item_query.expansion === Expansion.CLASSIC) {
            return this.classic_wowhead.search(item_query.query);
        }
        return this.tbc_wowhead.search(item_query.query);
    }

    private async act_on_item_query(item_query: ItemQuery, message: Message): Promise<void> {
        const item = await this.item_query_to_item(item_query);
        const richembed = this.richembed_factory.make_richembed_from_item(item);
        message.channel.send(richembed);
        this.external_item_storage.store_item(item);
    }

    public async act_on_message(message: Message): Promise<void[]> {
        const item_queries = this.get_all_item_queries_from_message(message);
        const action_promises = item_queries.map((item_query) => {
            return this.act_on_item_query(item_query, message);
        });
        return Promise.all(action_promises);
    }
}
