import { Message } from "./message";
import { Expansion } from "../expansion";
import { ItemQueryExtractor, ItemQuery } from "./query_extractor";

export class ItemQueryProcessor {
    public static create_actions_from_message(message: Message, default_expansion: Expansion): ItemQuery[] {
        const query_extractor = new ItemQueryExtractor(default_expansion);
        const item_queries = query_extractor.extract(message.content);
        for (const q of item_queries) {
            message.channel.send(JSON.stringify(q));
        }
        return item_queries;
    }
}
