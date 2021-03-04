/// <reference types="jest" />
import { LevelRequirementParser } from "../../src/parsers/level";
import { item_page_sources } from "../resources";

describe("Level requirement parser", () => {
    describe("ClassicDB", () => {
        it("parses level requirement value from classicdb.ch item page source", async () => {
            const parser = new LevelRequirementParser(item_page_sources.skullflame_shield.classicdb);
            const result = await parser.parse();
            expect(result).toStrictEqual(54);
        });
        it("fails to parse level requirement from item page source without a level requirement", async () => {
            const parser = new LevelRequirementParser(item_page_sources.barrel.classicdb);
            const result = await parser.parse();
            expect(result).toBe(-1);
        });
    });

    describe("TBCDB", () => {
        it("parses level requirement value from tbcdb.com item page source", async () => {
            const parser = new LevelRequirementParser(item_page_sources.skullflame_shield.tbcdb);
            const result = await parser.parse();
            expect(result).toStrictEqual(54);
        });
        it("fails to parse level requirement from item page source without a level requirement", async () => {
            const parser = new LevelRequirementParser(item_page_sources.barrel.tbcdb);
            const result = await parser.parse();
            expect(result).toBe(-1);
        });
    });
});
