/// <reference types="jest" />
import { item_page_sources } from "../resources";
import { UniqueParser } from "../../src/parsers/unique";

describe("Unique parser", () => {
    describe("ClassicDB", () => {
        it("parses unique status from classicdb.ch item page source", async () => {
            const parser = new UniqueParser(item_page_sources.nozdormu.classicdb);
            const result = parser.parse();
            expect(result).toBe(true);
        });

        it("parses non-unique status from non-unique item page source", async () => {
            const parser = new UniqueParser(item_page_sources.shadowfang.classicdb);
            const result = parser.parse();
            expect(result).toBe(false);
        });
    });

    describe("TBCDB", () => {
        it("parses unique status from item page source", async () => {
            const parser = new UniqueParser(item_page_sources.nozdormu.tbcdb);
            const result = parser.parse();
            expect(result).toBe(true);
        });

        it("fails to parse a thumbnail from empty item page source", async () => {
            const parser = new UniqueParser(item_page_sources.shadowfang.tbcdb);
            const result = parser.parse();
            expect(result).toBe(false);
        });
    });
});
