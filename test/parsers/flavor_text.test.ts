/// <reference types="jest" />
import { FlavorTextParser } from "../../src/parsers/flavor_text";
import { item_page_sources } from "../resources";

describe("Flavor text parser", () => {
    describe("ClassicDB", () => {
        it("parses flavor text from classicdb.ch item page source", async () => {
            const parser = new FlavorTextParser(item_page_sources.quelserrar.classicdb);
            const result = parser.parse();
            expect(result).toBe('"The High Blade"');
        });
        it("fails to parse flavor text from item page source with no flavor text", async () => {
            const parser = new FlavorTextParser(item_page_sources.thunderfury.classicdb);
            const result = parser.parse();
            expect(result).toBe("");
        });
    });

    describe("TBCDB", () => {
        it("parses flavor text from tbcdb.com item page source", async () => {
            const parser = new FlavorTextParser(item_page_sources.quelserrar.tbcdb);
            const result = parser.parse();
            expect(result).toBe('"The High Blade"');
        });
        it("fails to parse flavor text from item page source with no flavor text", async () => {
            const parser = new FlavorTextParser(item_page_sources.thunderfury.tbcdb);
            const result = parser.parse();
            expect(result).toBe("");
        });
    });
});
