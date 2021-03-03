/// <reference types="jest" />
import * as fs from "fs";
import { TBCDBClassParser, ClassicDBClassParser } from "../../src/parsers/class";

const classicdb_thunderfury_page_source = fs.readFileSync("res/test/classicdb_thunderfury_item_page.html").toString();
const tbcdb_thunderfury_page_source = fs.readFileSync("res/test/tbcdb_thunderfury_item_page.html").toString();
const classicdb_quelserrar_page_source = fs.readFileSync("res/test/classicdb_quelserrar_item_page.html").toString();
const tbcdb_quelserrar_page_source = fs.readFileSync("res/test/tbcdb_quelserrar_item_page.html").toString();

describe("Class parser", () => {
    describe("ClassicDB", () => {
        it("parses class requirements from classicdb.ch item page source", async () => {
            const parser = new ClassicDBClassParser(classicdb_quelserrar_page_source);
            const result = await parser.parse();
            expect(result).toStrictEqual(["Warrior", "Paladin"]);
        });
        it("fails to parse class requirements from empty item page source", async () => {
            const parser = new ClassicDBClassParser(classicdb_thunderfury_page_source);
            const result = await parser.parse();
            expect(result).toStrictEqual([]);
        });
    });

    describe("TBCDB", () => {
        it("parses class requirements from tbcdb.com item page source", async () => {
            const parser = new TBCDBClassParser(tbcdb_quelserrar_page_source);
            const result = await parser.parse();
            expect(result).toStrictEqual(["Warrior", "Paladin"]);
        });
        it("fails to parse class requirements from empty item page source", async () => {
            const parser = new TBCDBClassParser(tbcdb_thunderfury_page_source);
            const result = await parser.parse();
            expect(result).toStrictEqual([]);
        });
    });
});
