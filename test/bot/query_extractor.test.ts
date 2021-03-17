/// <reference types="jest" />
import { Expansion } from "../../src/expansion";
import { ItemQueryExtractor, ItemQueryType } from "../../src/message/query_extractor";

describe("Query extractor", () => {
    it("extacts item id query", () => {
        const item_query_extractor = new ItemQueryExtractor(Expansion.CLASSIC);
        const result = item_query_extractor.extract("[133]");
        expect(result.length).toBe(1);
        expect(result[0].query).toBe("133");
        expect(result[0].expansion).toBe(Expansion.CLASSIC);
        expect(result[0].type).toBe(ItemQueryType.ID);
    });

    it("extacts item name query", () => {
        const item_query_extractor = new ItemQueryExtractor(Expansion.CLASSIC);
        const result = item_query_extractor.extract("[abcdefg]");
        expect(result.length).toBe(1);
        expect(result[0].query).toBe("abcdefg");
        expect(result[0].expansion).toBe(Expansion.CLASSIC);
        expect(result[0].type).toBe(ItemQueryType.NAME);
    });

    it("extacts classic expansion", () => {
        const item_query_extractor = new ItemQueryExtractor(Expansion.CLASSIC);
        const result = item_query_extractor.extract("[abcdefg](classic)");
        expect(result.length).toBe(1);
        expect(result[0].expansion).toBe(Expansion.CLASSIC);
    });

    it("extacts tbc expansion", () => {
        const item_query_extractor = new ItemQueryExtractor(Expansion.CLASSIC);
        const result = item_query_extractor.extract("[abcdefg](tbc)");
        expect(result.length).toBe(1);
        expect(result[0].expansion).toBe(Expansion.TBC);
    });

    it("does not extract anything from an empty string", () => {
        const item_query_extractor = new ItemQueryExtractor(Expansion.CLASSIC);
        const result = item_query_extractor.extract("");
        const query_type = item_query_extractor.get_query_type("");
        expect(result.length).toBe(0);
        expect(query_type).toBe(ItemQueryType.NONE);
    });
});
