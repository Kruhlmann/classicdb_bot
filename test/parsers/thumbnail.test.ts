/// <reference types="jest" />
import * as fs from "fs";
import { ClassicDBThumbnailParser, TBCDBThumbnailParser } from "../../src/parsers/thumbnail";

const classicdb_thunderfury_page_source = fs.readFileSync("res/test/classicdb_thunderfury_item_page.html").toString();
const tbcdb_thunderfury_page_source = fs.readFileSync("res/test/tbcdb_thunderfury_item_page.html").toString();

describe("Thumbnail parser", () => {
    it("parses a thumbnail from classicdb.ch item page source", async () => {
        const parser = new ClassicDBThumbnailParser(classicdb_thunderfury_page_source);
        const result = await parser.parse();
        expect(result).toBe("https://classicdb.ch/images/icons/large/inv_sword_39.jpg");

        const invalid_parser = new ClassicDBThumbnailParser("");
        const invalid_result = await invalid_parser.parse();
        expect(invalid_result).toBe("");
    });

    it("parses a thumbnail from tbcdb.com item page source", async () => {
        const parser = new TBCDBThumbnailParser(tbcdb_thunderfury_page_source);
        const result = await parser.parse();
        expect(result).toBe("https://tbcdb.com/images/icons/large/inv_sword_39.jpg");

        const invalid_parser = new TBCDBThumbnailParser("");
        const invalid_result = await invalid_parser.parse();
        expect(invalid_result).toBe("");
    });
});
