/// <reference types="jest" />
import { QualityParser, ItemQuality } from "../../src/parsers/quality";
import { item_page_sources } from "../resources";

describe("Quality parser", () => {
    describe("ClassicDB", () => {
        it("parses artifact item quality from classicdb.ch item page source", async () => {
            const parser = new QualityParser(item_page_sources.audacity.classicdb);
            const result = parser.parse();
            expect(result).toBe(ItemQuality.ARTIFACT);
        });

        it("parses legendary item quality from classicdb.ch item page source", async () => {
            const parser = new QualityParser(item_page_sources.thunderfury.classicdb);
            const result = parser.parse();
            expect(result).toBe(ItemQuality.LEGENDARY);
        });

        it("parses epic item quality from classicdb.ch item page source", async () => {
            const parser = new QualityParser(item_page_sources.quelserrar.classicdb);
            const result = parser.parse();
            expect(result).toBe(ItemQuality.EPIC);
        });

        it("parses rare item quality from classicdb.ch item page source", async () => {
            const parser = new QualityParser(item_page_sources.cenarius.classicdb);
            const result = parser.parse();
            expect(result).toBe(ItemQuality.RARE);
        });

        it("parses uncommon item quality from classicdb.ch item page source", async () => {
            const parser = new QualityParser(item_page_sources.nozdormu.classicdb);
            const result = parser.parse();
            expect(result).toBe(ItemQuality.UNCOMMON);
        });

        it("parses common item quality from classicdb.ch item page source", async () => {
            const parser = new QualityParser(item_page_sources.bloodcap.classicdb);
            const result = parser.parse();
            expect(result).toBe(ItemQuality.COMMON);
        });

        it("parses poor item quality from classicdb.ch item page source", async () => {
            const parser = new QualityParser(item_page_sources.barrel.classicdb);
            const result = parser.parse();
            expect(result).toBe(ItemQuality.POOR);
        });

        it("fails to parse item quality from empty item page source", async () => {
            const parser = new QualityParser("");
            const result = parser.parse();
            expect(result).toBe(ItemQuality.POOR);
        });
    });

    describe("TBCDB", () => {
        it("parses artifact item quality from tbcdb.com item page source", async () => {
            const parser = new QualityParser(item_page_sources.audacity.classicdb);
            const result = parser.parse();
            expect(result).toBe(ItemQuality.ARTIFACT);
        });

        it("parses legendary item quality from tbcdb.com item page source", async () => {
            const parser = new QualityParser(item_page_sources.thunderfury.classicdb);
            const result = parser.parse();
            expect(result).toBe(ItemQuality.LEGENDARY);
        });

        it("parses epic item quality from tbcdb.com item page source", async () => {
            const parser = new QualityParser(item_page_sources.quelserrar.classicdb);
            const result = parser.parse();
            expect(result).toBe(ItemQuality.EPIC);
        });

        it("parses rare item quality from tbcdb.com item page source", async () => {
            const parser = new QualityParser(item_page_sources.cenarius.classicdb);
            const result = parser.parse();
            expect(result).toBe(ItemQuality.RARE);
        });

        it("parses uncommon item quality from tbcdb.com item page source", async () => {
            const parser = new QualityParser(item_page_sources.nozdormu.classicdb);
            const result = parser.parse();
            expect(result).toBe(ItemQuality.UNCOMMON);
        });

        it("parses common item quality from tbcdb.com item page source", async () => {
            const parser = new QualityParser(item_page_sources.bloodcap.classicdb);
            const result = parser.parse();
            expect(result).toBe(ItemQuality.COMMON);
        });

        it("parses poor item quality from tbcdb.com item page source", async () => {
            const parser = new QualityParser(item_page_sources.barrel.classicdb);
            const result = parser.parse();
            expect(result).toBe(ItemQuality.POOR);
        });

        it("fails to parse item quality from empty item page source", async () => {
            const parser = new QualityParser("");
            const result = parser.parse();
            expect(result).toBe(ItemQuality.POOR);
        });
    });
});
