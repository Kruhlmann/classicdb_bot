/// <reference types="jest" />
import { ArmorValueParser } from "../../src/parsers/armor";
import { item_page_sources } from "../resources";

describe("Armor parser", () => {
    describe("ClassicDB", () => {
        it("parses armor value from classicdb.ch item page source", async () => {
            let parser = new ArmorValueParser(item_page_sources.arcanist_belt.classicdb);
            let result = parser.parse();
            expect(result).toBe(57);

            parser = new ArmorValueParser(item_page_sources.the_hungering_cold.classicdb);
            result = parser.parse();
            expect(result).toBe(140);
        });

        it("fails to parse armor value from item page source with no armor value", async () => {
            const parser = new ArmorValueParser(item_page_sources.thunderfury.classicdb);
            const result = parser.parse();
            expect(result).toBe(-1);
        });
    });

    describe("TBCDB", () => {
        it("parses armor value from tbcdb.com item page source", async () => {
            let parser = new ArmorValueParser(item_page_sources.arcanist_belt.tbcdb);
            let result = parser.parse();
            expect(result).toBe(65);

            parser = new ArmorValueParser(item_page_sources.the_hungering_cold.tbcdb);
            result = parser.parse();
            expect(result).toBe(140);
        });

        it("fails to parse armor value from item page source with no armor value", async () => {
            const parser = new ArmorValueParser(item_page_sources.thunderfury.tbcdb);
            const result = parser.parse();
            expect(result).toBe(-1);
        });
    });
});
