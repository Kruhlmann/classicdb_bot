/// <reference types="jest" />
import { item_page_sources } from "../resources";
import { UniqueParser } from "../../src/parsers/unique";

describe("Quest parser", () => {
    describe("ClassicDB", () => {
        it("finds that an item is part of a quest from classicdb.ch item page source", async () => {
            const parser = new UniqueParser(item_page_sources.huge_gnoll_paw.classicdb);
            const result = await parser.parse();
            expect(result).toBe(true);
        });

        it("finds that an item is not part of a quest from classicdb.ch item page source", async () => {
            const parser = new UniqueParser(item_page_sources.shadowfang.classicdb);
            const result = await parser.parse();
            expect(result).toBe(false);
        });
    });
});
