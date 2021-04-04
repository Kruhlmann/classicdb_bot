import * as request from "request-promise";

import { IOpenAPIResponseParser, OpenAPIResponseItemQueryIDParser } from "./openapi";

export interface PageSourceContext {
    page_source: string;
    page_url: string;
    item_id: number;
}

export interface IWowHeadPageSourceResolver {
    get_page_source_from_query(item_query: string): Promise<PageSourceContext>;
}

export class WowHeadItemPageSourceResolver implements IWowHeadPageSourceResolver {
    private readonly base_path: string;
    private readonly openapi_response_parser: IOpenAPIResponseParser<number>;

    public constructor(base_path: string) {
        this.base_path = base_path;
        this.openapi_response_parser = new OpenAPIResponseItemQueryIDParser();
    }

    private get_item_url_from_id(item_id: string | number): string {
        return `${this.base_path}/?item=${item_id}`;
    }

    private async get_page_source_from_id(item_id: string | number): Promise<string> {
        return request(this.get_item_url_from_id(item_id));
    }

    private async get_item_id_from_query(query: string): Promise<number> {
        const url = `${this.base_path}/opensearch.php?search=${query}`;
        const results = await request({ uri: url, json: true });
        return this.openapi_response_parser.parse(results);
    }

    public async get_page_source_from_query(item_query: string): Promise<PageSourceContext> {
        const id = await this.get_item_id_from_query(item_query);
        return {
            page_source: await this.get_page_source_from_id(id),
            page_url: this.get_item_url_from_id(id),
            item_id: id,
        };
    }
}
