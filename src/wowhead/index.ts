import { IWowHeadPageSourceResolver, WowHeadItemPageSourceResolver, PageSourceContext } from "./item_query_resolver";
import { Item } from "../item";
import { ItemFactory, IItemFactory } from "../item/factory";
import { Expansion } from "../expansion";

export interface IWowHead {
    search(query: string): Promise<Item>;
}

export abstract class WowHead implements IWowHead {
    protected readonly page_source_resolver: IWowHeadPageSourceResolver;
    protected readonly item_factory: IItemFactory;

    public constructor(base_path: string, expansion: Expansion) {
        this.page_source_resolver = new WowHeadItemPageSourceResolver(base_path);
        this.item_factory = new ItemFactory(expansion);
    }

    public async search(query: string): Promise<Item> {
        const page_source_ctx = await this.page_source_resolver.get_page_source_from_query(query);
        return this.item_factory.from_page_source(page_source_ctx.page_source, page_source_ctx.page_url);
    }
}

export class ClassicDB extends WowHead {
    public constructor(base_path: string) {
        super(base_path, Expansion.CLASSIC);
    }
}

export class TBCDB extends WowHead {
    public constructor(base_path: string) {
        super(base_path, Expansion.TBC);
    }
}
