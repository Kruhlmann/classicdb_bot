/// <reference types="jest" />
import { BlockValueParser } from "../../src/parsers/block_value";
import { item_page_sources } from "../resources";

describe("Block value parser", () => {
    describe("ClassicDB", () => {
        it("parses block value from classicdb.ch item page source", async () => {
            const parser = new BlockValueParser(item_page_sources.skullflame_shield.classicdb);
            const result = await parser.parse();
            expect(result).toBe(40);
        });
        it("fails to parse block value from item page source without block value", async () => {
            const parser = new BlockValueParser(item_page_sources.thunderfury.classicdb);
            const result = await parser.parse();
            expect(result).toBe(-1);
        });
    });

    describe("TBCDB", () => {
        it("parses block value from tbcdb.com item page source", async () => {
            const parser = new BlockValueParser(item_page_sources.skullflame_shield.tbcdb);
            const result = await parser.parse();
            expect(result).toBe(53);
        });
        it("fails to parse block value from item page source without block value", async () => {
            const parser = new BlockValueParser(item_page_sources.thunderfury.tbcdb);
            const result = await parser.parse();
            expect(result).toBe(-1);
        });
    });
});
