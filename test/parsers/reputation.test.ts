/// <reference types="jest" />
import { ReputationRequirementParser, ReputationState } from "../../src/parsers/reputation";
import { item_page_sources } from "../resources";

describe("Reputation requirement parser", () => {
    describe("ClassicDB", () => {
        it("parses reputation requirement from classicdb.ch item page source", async () => {
            const parser = new ReputationRequirementParser(item_page_sources.arathor_battle_tabard.classicdb);
            const result = parser.parse();
            expect(result).toStrictEqual({ name: "The League of Arathor", state: ReputationState.EXALTED });
        });
        it("fails to parse reputation requirement from item page source without reputation requirement", async () => {
            const parser = new ReputationRequirementParser(item_page_sources.barrel.classicdb);
            const result = parser.parse();
            expect(result).toStrictEqual({ name: "", state: ReputationState.NONE });
        });
    });

    describe("TBCDB", () => {
        it("parses reputation requirement from tbcdb.com item page source", async () => {
            const parser = new ReputationRequirementParser(item_page_sources.scryers_bloodgem.tbcdb);
            const result = parser.parse();
            expect(result).toStrictEqual({ name: "The Scryers", state: ReputationState.REVERED });
        });

        it("fails to parse reputation requirement from item page source without reputation requirement", async () => {
            const parser = new ReputationRequirementParser(item_page_sources.barrel.tbcdb);
            const result = parser.parse();
            expect(result).toStrictEqual({ name: "", state: ReputationState.NONE });
        });
    });
});
