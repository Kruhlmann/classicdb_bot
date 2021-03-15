import { ClassicDB, TBCDB, WowHead } from "../wowhead";
import { Message } from ".";
import { ItemQuery } from "./query_extractor";
import { Expansion } from "../expansion";
import { ItemQueryProcessor } from "../item/processor";
import { ItemFactory } from "../item/factory";
import { Item } from "../item";
import { RichEmbedFactory } from "./richembed_factory";

export class MessageHandler {
    private readonly classic_wowhead: WowHead;
    private readonly tbc_wowhead: WowHead;
    private readonly classic_item_factory: ItemFactory;
    private readonly tbc_item_factory: ItemFactory;

    public constructor() {
        this.classic_wowhead = new ClassicDB("https://classicdb.ch");
        this.tbc_wowhead = new TBCDB("https://tbcdb.com");
        this.classic_item_factory = new ItemFactory(Expansion.CLASSIC);
        this.tbc_item_factory = new ItemFactory(Expansion.CLASSIC);
    }

    private get_all_item_queries_from_message(message: Message): ItemQuery[] {
        return ItemQueryProcessor.get_all_item_queries_from_message(message, Expansion.CLASSIC);
    }

    public async item_query_to_item(item_query: ItemQuery): Promise<Item> {
        if (item_query.expansion === Expansion.CLASSIC) {
            const { page_source, page_url } = await this.classic_wowhead.get_classic_item_page_source_from_query(
                item_query.query
            );
            const item = this.classic_item_factory.from_page_source(page_source, page_url);
            return item;
        }
        const { page_source, page_url } = await this.tbc_wowhead.get_tbc_item_page_source_from_query(item_query.query);
        const item = this.tbc_item_factory.from_page_source(page_source, page_url);
        return item;
    }

    private async act_on_item_query(item_query: ItemQuery, message: Message): Promise<void> {
        const item = await this.item_query_to_item(item_query);
        const richembed_factory = new RichEmbedFactory(
            "https://images-ext-1.discordapp.net/external/s8uTI5co6Kys0_gnCCuzQOPsc5cAkoqivBFSpH5wnv8/https/orig08.deviantart.net/65e3/f/2014/207/e/2/official_wow_icon_by_benashvili-d7sd1ab.png",
            "https://discord.gg/mRUEPnp",
            "https://images-ext-2.discordapp.net/external/qwilFmqqSub3IKzUz47jRtBSMIR2RQVA8tjqxRHfavk/https/discordapp.com/assets/28174a34e77bb5e5310ced9f95cb480b.png"
        );
        const richembed = richembed_factory.make_richembed_from_item(item);
        message.channel.send(richembed);
    }

    public async act_on_message(message: Message): Promise<void[]> {
        const item_queries = this.get_all_item_queries_from_message(message);
        const action_promises = item_queries.map((item_query) => {
            return this.act_on_item_query(item_query, message);
        });
        return Promise.all(action_promises);
    }
}
