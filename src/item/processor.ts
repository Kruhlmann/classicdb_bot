import { Message } from "../message";
import { Expansion } from "../expansion";
import { ItemQueryExtractor, ItemQuery } from "../message/query_extractor";

export class ItemQueryProcessor {
    public static get_all_item_queries_from_message(message: Message, default_expansion: Expansion): ItemQuery[] {
        const query_extractor = new ItemQueryExtractor(default_expansion);
        const item_queries = query_extractor.extract(message.content);
        return item_queries;
    }
}
