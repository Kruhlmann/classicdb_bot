/// <reference types="jest" />
import * as fs from "fs";
import { TBCDBClassParser, ClassicDBClassParser } from "../../src/parsers/class";

const classicdb_thunderfury_page_source = fs.readFileSync("res/test/classicdb_thunderfury_item_page.html").toString();
const tbcdb_thunderfury_page_source = fs.readFileSync("res/test/tbcdb_thunderfury_item_page.html").toString();
const classicdb_quelserrar_page_source = fs.readFileSync("res/test/classicdb_quelserrar_item_page.html").toString();
const tbcdb_quelserrar_page_source = fs.readFileSync("res/test/tbcdb_quelserrar_item_page.html").toString();

describe("Class parser", () => {
    it("parses class requirements from classicdb.ch item page source", async () => {
        const parser = new ClassicDBClassParser(classicdb_quelserrar_page_source);
        const result = await parser.parse();
        expect(result).toStrictEqual(["Warrior", "Paladin"]);

        const invalid_parser = new ClassicDBClassParser(classicdb_thunderfury_page_source);
        const invalid_result = await invalid_parser.parse();
        expect(invalid_result).toStrictEqual([]);
    });

    it("parses class requirements from tbcdb.com item page source", async () => {
        const parser = new TBCDBClassParser(tbcdb_quelserrar_page_source);
        const result = await parser.parse();
        expect(result).toStrictEqual(["Warrior", "Paladin"]);

        const invalid_parser = new TBCDBClassParser(tbcdb_thunderfury_page_source);
        const invalid_result = await invalid_parser.parse();
        expect(invalid_result).toStrictEqual([]);
    });
});
