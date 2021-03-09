import { ClassicDB, TBCDB, WowHead } from "../wowhead";
import { Message } from "./message";
import { ItemQuery } from "./query_extractor";
import { Expansion } from "../expansion";
import { ItemQueryProcessor } from "./item_processor";
import { HTMLParser } from "../parsers";
import { ItemFactory } from "./item_factory";

export class MessageHandler {
    private readonly classic_wowhead: WowHead;
    private readonly tbc_wowhead: WowHead;
    private readonly classic_item_factory: ItemFactory;
    private readonly tbc_item_factory: ItemFactory;

    public constructor() {
        this.classic_wowhead = new ClassicDB("https://tbcdb.com");
        this.tbc_wowhead = new TBCDB("https://classicdb.ch");
        this.classic_item_factory = new ItemFactory(Expansion.CLASSIC);
        this.tbc_item_factory = new ItemFactory(Expansion.CLASSIC);
    }

    private get_all_item_queries_from_message(message: Message): ItemQuery[] {
        return ItemQueryProcessor.get_all_item_queries_from_message(message, Expansion.CLASSIC);
    }

    private async act_on_item_query(item_query: ItemQuery, message: Message): Promise<void> {
        if (item_query.expansion === Expansion.CLASSIC) {
            const page_source = await this.classic_wowhead.get_classic_item_page_source_from_query(item_query.query);
            const item = this.classic_item_factory.from_page_source(page_source);
            message.channel.send(JSON.stringify(item));
        }
    }

    public async act_on_message(message: Message): Promise<void[]> {
        const item_queries = this.get_all_item_queries_from_message(message);
        const action_promises = item_queries.map((item_query) => {
            return this.act_on_item_query(item_query, message);
        });
        return Promise.all(action_promises);
    }
}
