import * as request from "request-promise";

type OpenAPIResponse = [
    string,
    string[],
    never[],
    never[],
    never[],
    never[],
    never[],
    Array<[number, number] | [number, number, number] | [number, number, string, number]>
];

export abstract class WowHead {
    private readonly OPENAPI_ITEM_DETAILS_INDEX = 7;
    private readonly OPENAPI_ITEM_ID_INDEX = 1;
    private readonly base_path: string;

    public constructor(base_path: string) {
        this.base_path = base_path;
    }

    private async get_page_source_from_id(item_id: string | number): Promise<string> {
        return request(`${this.base_path}/?item=${item_id}`);
    }

    private async get_item_id_from_query(query: string): Promise<number> {
        const url = `${this.base_path}/opensearch.php?search=${query}`;
        const results = await request({ uri: url, json: true });
        return this.get_item_id_from_potentially_empty_openapi_response(results);
    }

    private get_item_id_from_potentially_empty_openapi_response(results: OpenAPIResponse): number | undefined {
        const missing_details = results.length < this.OPENAPI_ITEM_DETAILS_INDEX + 1;
        if (missing_details) {
            return;
        }
        return this.get_id_of_first_item_in_nonempty_openapi_response(results);
    }

    private get_id_of_first_item_in_nonempty_openapi_response(results: OpenAPIResponse): number | number {
        const item_details = results[this.OPENAPI_ITEM_DETAILS_INDEX];
        console.log(item_details[0][this.OPENAPI_ITEM_ID_INDEX]);
        if (item_details[0]) {
            const item_id = item_details[0][this.OPENAPI_ITEM_ID_INDEX];
            return item_id;
        }
    }

    protected async get_page_source_from_query(item_query: string): Promise<string> {
        const id = await this.get_item_id_from_query(item_query);
        return this.get_page_source_from_id(id);
    }

    public abstract async get_classic_item_page_source_from_query(query: string): Promise<string>;
    public abstract async get_tbc_item_page_source_from_query(query: string): Promise<string>;
}

export class ClassicDB extends WowHead {
    public async get_classic_item_page_source_from_query(query: string): Promise<string> {
        return this.get_page_source_from_query(query);
    }

    public async get_tbc_item_page_source_from_query(_query: string): Promise<string> {
        return "";
    }
}

export class TBCDB extends WowHead {
    public async get_tbc_item_page_source_from_query(query: string): Promise<string> {
        return this.get_page_source_from_query(query);
    }

    public async get_classic_item_page_source_from_query(_query: string): Promise<string> {
        return "";
    }
}
