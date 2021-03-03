/// <reference types="jest" />
import { item_page_sources } from "../resources";
import { ArmorValueParser } from "../../src/parsers/armor";

describe("Armor parser", () => {
    describe("ClassicDB", () => {
        it("parses armor value status from classicdb.ch item page source", async () => {
            const parser = new ArmorValueParser(item_page_sources.arcanist_belt.classicdb);
            const result = await parser.parse();
            expect(result).toBe(57);
        });

        it("fails to parse status from item page source with no armor value", async () => {
            const parser = new ArmorValueParser(item_page_sources.thunderfury.classicdb);
            const result = await parser.parse();
            expect(result).toBe(-1);
        });
    });
});
