/// <reference types="jest" />
import { Skill, SkillRequirementParser } from "../../src/parsers/skill";
import { item_page_sources } from "../resources";

describe("Skill requirement parser", () => {
    describe("ClassicDB", () => {
        it("parses skill requirement from classicdb.ch item page source", async () => {
            const parser = new SkillRequirementParser(item_page_sources.heavy_mageweave_bandage.classicdb);
            const result = parser.parse();
            expect(result).toStrictEqual({ skill: Skill.FIRST_AID, value: 175 });
        });
        it("fails to parse skill requirement from item page source without skill requirement", async () => {
            const parser = new SkillRequirementParser(item_page_sources.barrel.classicdb);
            const result = parser.parse();
            expect(result).toStrictEqual({ skill: Skill.NONE, value: -1 });
        });
    });

    describe("TBCDB", () => {
        it("parses skill requirement from tbcdb.com item page source", async () => {
            const parser = new SkillRequirementParser(item_page_sources.heavy_mageweave_bandage.tbcdb);
            const result = parser.parse();
            expect(result).toStrictEqual({ skill: Skill.FIRST_AID, value: 175 });
        });

        it("fails to parse skill requirement from item page source without skill requirement", async () => {
            const parser = new SkillRequirementParser(item_page_sources.barrel.tbcdb);
            const result = parser.parse();
            expect(result).toStrictEqual({ skill: Skill.NONE, value: -1 });
        });
    });
});
