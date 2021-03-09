/// <reference types="jest" />
import { DurabilityParser } from "../../src/parsers/durability";
import { item_page_sources } from "../resources";

describe("Level requirement parser", () => {
    describe("ClassicDB", () => {
        it("parses durability value from classicdb.ch item page source", async () => {
            const parser = new DurabilityParser(item_page_sources.skullflame_shield.classicdb);
            const result = parser.parse();
            expect(result).toBe(120);
        });
        it("fails to parse durability value from item page source without durability", async () => {
            const parser = new DurabilityParser(item_page_sources.barrel.classicdb);
            const result = parser.parse();
            expect(result).toBe(-1);
        });
    });

    describe("TBCDB", () => {
        it("parses durability value from tbcdb.com item page source", async () => {
            const parser = new DurabilityParser(item_page_sources.skullflame_shield.tbcdb);
            const result = parser.parse();
            expect(result).toBe(120);
        });
        it("fails to parse durability value from item page source without durability", async () => {
            const parser = new DurabilityParser(item_page_sources.barrel.tbcdb);
            const result = parser.parse();
            expect(result).toBe(-1);
        });
    });
});
