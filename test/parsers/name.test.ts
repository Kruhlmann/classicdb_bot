/// <reference types="jest" />
import { ClassicDBNameParser, TBCDBNameParser } from "../../src/parsers/name";
import { item_page_sources } from "../resources";

describe("Name parser", () => {
    describe("ClassicDB", () => {
        it("parses an item name from classicdb.ch item page source", async () => {
            const parser = new ClassicDBNameParser(item_page_sources.thunderfury.classicdb);
            const result = parser.parse();
            expect(result).toBe("Thunderfury, Blessed Blade of the Windseeker");
        });

        it("fails to parse an item name from empty item page source", async () => {
            const parser = new ClassicDBNameParser("");
            const result = parser.parse();
            expect(result).toBe("");
        });
    });

    describe("TBCDB", () => {
        it("parses an item name from tbcdb.com item page source", async () => {
            const parser = new TBCDBNameParser(item_page_sources.thunderfury.tbcdb);
            const result = parser.parse();
            expect(result).toBe("Thunderfury, Blessed Blade of the Windseeker");
        });

        it("fails to parse an item name from empty item page source", async () => {
            const parser = new TBCDBNameParser("");
            const result = parser.parse();
            expect(result).toBe("");
        });
    });
});
