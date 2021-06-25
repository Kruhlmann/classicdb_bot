/// <reference types="jest" />
import { CastTimeParser } from "../../src/parsers/cast_time";
import { spell_page_sources } from "../resources";

describe("Cast time parser", () => {
    describe("ClassicDB", () => {
        it("parses cast time from classicdb.ch item page source", async () => {
            const parser = new CastTimeParser(spell_page_sources.deathbringer_shadow_bolt.classicdb);
            const result = parser.parse();
            expect(result).toBe(2.2);
        });

        it("parses instant cast time from classicdb.ch item page source", async () => {
            const parser = new CastTimeParser(spell_page_sources.thunderfury.classicdb);
            const result = parser.parse();
            expect(result).toBe(0);
        });
    });

    describe("TBCDB", () => {
        it("parses cast time from tbcdb.com item page source", async () => {
            const parser = new CastTimeParser(spell_page_sources.deathbringer_shadow_bolt.tbcdb);
            const result = parser.parse();
            expect(result).toBe(2.2);
        });

        it("parses instant cast time from tbcdb.com item page source", async () => {
            const parser = new CastTimeParser(spell_page_sources.thunderfury.tbcdb);
            const result = parser.parse();
            expect(result).toBe(0);
        });
    });
});
