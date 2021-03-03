/// <reference types="jest" />
import { ClassicDBThumbnailParser, TBCDBThumbnailParser } from "../../src/parsers/thumbnail";
import { item_page_sources } from "../resources";

describe("Thumbnail parser", () => {
    describe("ClassicDB", () => {
        it("parses a thumbnail from item page source", async () => {
            const parser = new ClassicDBThumbnailParser(item_page_sources.thunderfury.classicdb);
            const result = await parser.parse();
            expect(result).toBe("https://classicdb.ch/images/icons/large/inv_sword_39.jpg");
        });

        it("fails to parse a thumbnail from empty item page source", async () => {
            const parser = new ClassicDBThumbnailParser("");
            const result = await parser.parse();
            expect(result).toBe("");
        });
    });

    describe("TBCDB", () => {
        it("parses a thumbnail from item page source", async () => {
            const parser = new TBCDBThumbnailParser(item_page_sources.thunderfury.tbcdb);
            const result = await parser.parse();
            expect(result).toBe("https://tbcdb.com/images/icons/large/inv_sword_39.jpg");
        });

        it("fails to parse a thumbnail from empty item page source", async () => {
            const parser = new TBCDBThumbnailParser("");
            const result = await parser.parse();
            expect(result).toBe("");
        });
    });
});
