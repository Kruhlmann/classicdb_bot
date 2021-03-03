/// <reference types="jest" />
import * as fs from "fs";
import { ClassicDBNameParser, TBCDBNameParser } from "../../src/parsers/name";

const classicdb_thunderfury_page_source = fs.readFileSync("res/test/classicdb_thunderfury_item_page.html").toString();
const tbcdb_thunderfury_page_source = fs.readFileSync("res/test/tbcdb_thunderfury_item_page.html").toString();

describe("Name parser", () => {
    it("parses an item name from classicdb.ch item page source", async () => {
        const parser = new ClassicDBNameParser(classicdb_thunderfury_page_source);
        const result = await parser.parse();
        expect(result).toBe("Thunderfury, Blessed Blade of the Windseeker");

        const invalid_parser = new ClassicDBNameParser("");
        const invalid_result = await invalid_parser.parse();
        expect(invalid_result).toBe("");
    });

    it("parses an item name from tbcdb.com item page source", async () => {
        const parser = new TBCDBNameParser(tbcdb_thunderfury_page_source);
        const result = await parser.parse();
        expect(result).toBe("Thunderfury, Blessed Blade of the Windseeker");

        const invalid_parser = new TBCDBNameParser("");
        const invalid_result = await invalid_parser.parse();
        expect(invalid_result).toBe("");
    });
});
