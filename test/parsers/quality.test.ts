/// <reference types="jest" />
import { QualityParser } from "../../src/parsers/quality";
import { item_page_sources } from "../resources";

describe("Quality parser", () => {
    describe("ClassicDB", () => {
        it("parses artifact item quality from classicdb.ch item page source", async () => {
            const parser = new QualityParser(item_page_sources.audacity.classicdb);
            const result = parser.parse();
            expect(result).toBe("artifact");
        });

        it("parses legendary item quality from classicdb.ch item page source", async () => {
            const parser = new QualityParser(item_page_sources.thunderfury.classicdb);
            const result = parser.parse();
            expect(result).toBe("legendary");
        });

        it("parses epic item quality from classicdb.ch item page source", async () => {
            const parser = new QualityParser(item_page_sources.quelserrar.classicdb);
            const result = parser.parse();
            expect(result).toBe("epic");
        });

        it("parses rare item quality from classicdb.ch item page source", async () => {
            const parser = new QualityParser(item_page_sources.cenarius.classicdb);
            const result = parser.parse();
            expect(result).toBe("rare");
        });

        it("parses uncommon item quality from classicdb.ch item page source", async () => {
            const parser = new QualityParser(item_page_sources.nozdormu.classicdb);
            const result = parser.parse();
            expect(result).toBe("uncommon");
        });

        it("parses common item quality from classicdb.ch item page source", async () => {
            const parser = new QualityParser(item_page_sources.bloodcap.classicdb);
            const result = parser.parse();
            expect(result).toBe("common");
        });

        it("parses poor item quality from classicdb.ch item page source", async () => {
            const parser = new QualityParser(item_page_sources.barrel.classicdb);
            const result = parser.parse();
            expect(result).toBe("poor");
        });

        it("fails to parse item quality from empty item page source", async () => {
            const parser = new QualityParser("");
            const result = parser.parse();
            expect(result).toBe("");
        });
    });

    describe("TBCDB", () => {
        it("parses artifact item quality from tbcdb.com item page source", async () => {
            const parser = new QualityParser(item_page_sources.audacity.classicdb);
            const result = parser.parse();
            expect(result).toBe("artifact");
        });

        it("parses legendary item quality from tbcdb.com item page source", async () => {
            const parser = new QualityParser(item_page_sources.thunderfury.classicdb);
            const result = parser.parse();
            expect(result).toBe("legendary");
        });

        it("parses epic item quality from tbcdb.com item page source", async () => {
            const parser = new QualityParser(item_page_sources.quelserrar.classicdb);
            const result = parser.parse();
            expect(result).toBe("epic");
        });

        it("parses rare item quality from tbcdb.com item page source", async () => {
            const parser = new QualityParser(item_page_sources.cenarius.classicdb);
            const result = parser.parse();
            expect(result).toBe("rare");
        });

        it("parses uncommon item quality from tbcdb.com item page source", async () => {
            const parser = new QualityParser(item_page_sources.nozdormu.classicdb);
            const result = parser.parse();
            expect(result).toBe("uncommon");
        });

        it("parses common item quality from tbcdb.com item page source", async () => {
            const parser = new QualityParser(item_page_sources.bloodcap.classicdb);
            const result = parser.parse();
            expect(result).toBe("common");
        });

        it("parses poor item quality from tbcdb.com item page source", async () => {
            const parser = new QualityParser(item_page_sources.barrel.classicdb);
            const result = parser.parse();
            expect(result).toBe("poor");
        });

        it("fails to parse item quality from empty item page source", async () => {
            const parser = new QualityParser("");
            const result = parser.parse();
            expect(result).toBe("");
        });
    });
});
