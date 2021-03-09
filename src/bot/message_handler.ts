import { ClassicDB, TBCDB, WowHead } from "../wowhead";
import { Message } from "./message";
import { ItemQuery } from "./query_extractor";
import { Expansion } from "../expansion";
import { ItemQueryProcessor } from "./item_processor";
import {HTMLParser} from "../parsers";

export class MessageHandler {
    private readonly classic_wowhead: WowHead;
    private readonly tbc_wowhead: WowHead;

    public constructor() {
        this.classic_wowhead = new TBCDB("https://classicdb.ch");
        this.tbc_wowhead = new ClassicDB("https://tbcdb.com");
    }

    private get_all_item_queries_from_message(message: Message): ItemQuery[] {
        return ItemQueryProcessor.get_all_item_queries_from_message(message, Expansion.CLASSIC);
    }

    private async act_on_item_query(item_query: ItemQuery, message: Message): Promise<void> {
        if (item_query.expansion === Expansion.CLASSIC) {
            const page_source = await this.classic_wowhead.get_classic_item_page_source_from_query(item_query.query);
            new Item.from_page_source(page_source);
        }
    }

    public async act_on_message(message: Message): Promise<void[]> {
        const item_queries = this.get_all_item_queries_from_message(message);
        const action_promises = item_queries.map((item_query) => {
            return this.act_on_item_query(item_query, message);
        }):
        return Promise.all(action_promises);
    }
}
for (const item_query of item_queries) {
    this.bot.classic_wowhead
        .get_item_id_from_query(item_query.query)
        .then((id) => {
            return this.bot.classic_wowhead.get_page_source_from_id(id);
        })
        .then((src) => {
            console.log(src);
        });
}
