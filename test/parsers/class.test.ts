/// <reference types="jest" />
import { TBCDBClassParser, ClassicDBClassParser } from "../../src/parsers/class";
import { item_page_sources } from "../resources";

describe("Class parser", () => {
    describe("ClassicDB", () => {
        it("parses class requirements from classicdb.ch item page source", async () => {
            const parser = new ClassicDBClassParser(item_page_sources.quelserrar.classicdb);
            const result = await parser.parse();
            expect(result).toStrictEqual(["Warrior", "Paladin"]);
        });
        it("fails to parse class requirements from item page source without class restrictions", async () => {
            const parser = new ClassicDBClassParser(item_page_sources.thunderfury.classicdb);
            const result = await parser.parse();
            expect(result).toStrictEqual([]);
        });
    });

    describe("TBCDB", () => {
        it("parses class requirements from tbcdb.com item page source", async () => {
            const parser = new TBCDBClassParser(item_page_sources.quelserrar.tbcdb);
            const result = await parser.parse();
            expect(result).toStrictEqual(["Warrior", "Paladin"]);
        });
        it("fails to parse class requirements from item page source without class restrictions", async () => {
            const parser = new TBCDBClassParser(item_page_sources.thunderfury.tbcdb);
            const result = await parser.parse();
            expect(result).toStrictEqual([]);
        });
    });
});
