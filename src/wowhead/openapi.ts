export type OpenAPIResponseGameObjectEntry = [number, number];
export type OpenAPIResponseQuestEntry = [number, number, number];
export type OpenAPIResponseItemEntry = [number, number, string, number];
export type OpenAPIResponseEntry =
    | OpenAPIResponseQuestEntry
    | OpenAPIResponseItemEntry
    | OpenAPIResponseGameObjectEntry;

export type OpenAPIResponse = [string, string[], [], [], [], [], [], OpenAPIResponseEntry[]];

export interface IOpenAPIResponseParser<ParsedEntryType> {
    parse(openapi_response: OpenAPIResponse): ParsedEntryType;
}

export class OpenAPIResponseItemQueryIDParser implements IOpenAPIResponseParser<number | undefined> {
    private readonly OPENAPI_ITEM_DETAILS_INDEX = 7;
    private readonly OPENAPI_ITEM_TYPE_INDEX = 0;
    private readonly OPENAPI_ITEM_ID_INDEX = 1;
    private readonly OPENAPI_ITEM_ISITEM_TYPE_ID = 3;

    protected get_item_details_from_openapi_response(results: OpenAPIResponse): OpenAPIResponseEntry[] {
        const item_details = results[this.OPENAPI_ITEM_DETAILS_INDEX];
        return item_details.filter((item) => {
            return item[this.OPENAPI_ITEM_TYPE_INDEX] === this.OPENAPI_ITEM_ISITEM_TYPE_ID;
        });
    }

    protected get_id_of_first_item_in_nonempty_openapi_response(results: OpenAPIResponse): number | number {
        const item_details = this.get_item_details_from_openapi_response(results);
        if (item_details[0]) {
            const item_id = item_details[0][this.OPENAPI_ITEM_ID_INDEX];
            return item_id;
        }
    }

    public parse(openapi_response: OpenAPIResponse): number {
        const missing_details = openapi_response.length < this.OPENAPI_ITEM_DETAILS_INDEX + 1;
        if (missing_details) {
            return;
        }
        return this.get_id_of_first_item_in_nonempty_openapi_response(openapi_response);
    }
}
