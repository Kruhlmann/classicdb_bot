import { Expansion, ExpansionLookupTable } from "../expansion";

export enum ItemQueryType {
    NONE,
    ID,
    NAME,
}

export type ItemQuery = {
    query: string;
    expansion: Expansion;
    type: ItemQueryType;
};

abstract class QueryExtractor {
    protected abstract readonly pattern: RegExp;

    public extract(source_string: string): ItemQuery[] {
        const results: ItemQuery[] = [];

        let match;
        do {
            match = this.pattern.exec(source_string);
            if (!match) {
                break;
            }
            const result = this.postformat(match);
            if (result) {
                results.push(result);
            }
        } while (match);

        return results;
    }

    public get_query_type(query: string): ItemQueryType {
        if (query === "") {
            return ItemQueryType.NONE;
        }
        if (query.match(/[0-9]+/)) {
            return ItemQueryType.ID;
        }
        return ItemQueryType.NAME;
    }

    public abstract postformat(match: string[]): ItemQuery;
}

export class ItemQueryExtractor extends QueryExtractor {
    protected readonly pattern = /\[(.*?)\](\((.*?)\))?/g;
    protected readonly default_expansion: Expansion;
    private lookup_table = new ExpansionLookupTable();

    public constructor(default_expansion: Expansion) {
        super();
        this.default_expansion = default_expansion;
    }

    public postformat(match: string[]): ItemQuery {
        let expansion = this.default_expansion;
        if (match[3]) {
            expansion = this.lookup_table.perform_lookup(match[3]);
        }
        return {
            query: match[1],
            expansion,
            type: this.get_query_type(match[1]),
        };
    }
}
