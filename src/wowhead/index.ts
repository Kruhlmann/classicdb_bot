import { IWowHeadPageSourceResolver, WowHeadItemPageSourceResolver, PageSourceContext } from "./item_query_resolver";

export type ItemDetails = Array<[number, number] | [number, number, number] | [number, number, string, number]>;
export type OpenAPIResponse = [
    string,
    string[],
    undefined[],
    undefined[],
    undefined[],
    undefined[],
    undefined[],
    ItemDetails
];

export interface IWowHead {
    get_classic_item_page_source_from_query(query: string): Promise<PageSourceContext>;
    get_tbc_item_page_source_from_query(query: string): Promise<PageSourceContext>;
}

export abstract class WowHead implements IWowHead {
    protected readonly page_source_resolver: IWowHeadPageSourceResolver;

    public constructor(base_path: string) {
        this.page_source_resolver = new WowHeadItemPageSourceResolver(base_path);
    }

    public abstract async get_classic_item_page_source_from_query(query: string): Promise<PageSourceContext>;
    public abstract async get_tbc_item_page_source_from_query(query: string): Promise<PageSourceContext>;
}

export class ClassicDB extends WowHead {
    public async get_classic_item_page_source_from_query(query: string): Promise<PageSourceContext> {
        return this.page_source_resolver.get_page_source_from_query(query);
    }

    public async get_tbc_item_page_source_from_query(): Promise<PageSourceContext> {
        console.warn("Tried to request a TBC page source using a classic instance of WowHead");
        return { page_source: "", page_url: "" };
    }
}

export class TBCDB extends WowHead {
    public async get_tbc_item_page_source_from_query(query: string): Promise<PageSourceContext> {
        return this.page_source_resolver.get_page_source_from_query(query);
    }

    public async get_classic_item_page_source_from_query(): Promise<PageSourceContext> {
        console.warn("Tried to request a classic page source using a TBC instance of WowHead");
        return { page_source: "", page_url: "" };
    }
}
