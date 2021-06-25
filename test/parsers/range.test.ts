/// <reference types="jest" />
import { RangeParser } from "../../src/parsers/range";
import { spell_page_sources } from "../resources";

describe("Range parser", () => {
    describe("ClassicDB", () => {
        it("parses range from classicdb.ch item page source", async () => {
            const parser = new RangeParser(spell_page_sources.thunderfury.classicdb);
            const result = parser.parse();
            expect(result).toBe(0);
        });

        it("fails to parse range from classicdb.ch page source with no range", async () => {
            const parser = new RangeParser(spell_page_sources.attack_power_38.classicdb);
            const result = parser.parse();
            expect(result).toBe(-1);
        });
    });

    describe("TBCDB", () => {
        it("parses range from tbcdb.com page source", async () => {
            const parser = new RangeParser(spell_page_sources.thunderfury.tbcdb);
            const result = parser.parse();
            expect(result).toBe(5);
        });

        it("fails to parse range from tbcdb.com page source with no range", async () => {
            const parser = new RangeParser(spell_page_sources.attack_power_38.tbcdb);
            const result = parser.parse();
            expect(result).toBe(-1);
        });
    });
});
