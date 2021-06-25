/// <reference types="jest" />
import { PVPRank, PVPRankRequirementParser } from "../../src/parsers/rank";
import { item_page_sources } from "../resources";

describe("PVP rank requirement parser", () => {
    describe("ClassicDB", () => {
        it("parses rank requirement from classicdb.ch item page source", async () => {
            const parser = new PVPRankRequirementParser(item_page_sources.reins_of_the_black_war_tiger.classicdb);
            const result = parser.parse();
            expect(result).toBe(PVPRank.COMMANDER);
        });
        it("fails to parse rank requirement from item page source without rank requirement", async () => {
            const parser = new PVPRankRequirementParser(item_page_sources.barrel.classicdb);
            const result = parser.parse();
            expect(result).toBe(PVPRank.NONE);
        });
    });

    describe("TBCDB", () => {
        it("fails to parse rank requirement from item page source without rank requirement", async () => {
            const parser = new PVPRankRequirementParser(item_page_sources.reins_of_the_black_war_tiger.tbcdb);
            const result = parser.parse();
            expect(result).toBe(PVPRank.NONE);
        });
    });
});
