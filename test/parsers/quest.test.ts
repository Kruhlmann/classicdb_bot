/// <reference types="jest" />
import { item_page_sources } from "../resources";
import { IsPartOfQuestParser, ClassicDBBeginsQuestParser, TBCDBBeginsQuestParser } from "../../src/parsers/quest";

describe("Quest parser", () => {
    describe("ClassicDB", () => {
        it("finds that an item is part of a quest from classicdb.ch item page source", async () => {
            const parser = new IsPartOfQuestParser(item_page_sources.huge_gnoll_paw.classicdb);
            const result = parser.parse();
            expect(result).toBe(true);
        });

        it("finds that an item is not part of a quest from classicdb.ch item page source", async () => {
            const parser = new IsPartOfQuestParser(item_page_sources.shadowfang.classicdb);
            const result = parser.parse();
            expect(result).toBe(false);
        });

        it("finds that an item starts a quest from classicdb.ch item page source", async () => {
            const parser = new ClassicDBBeginsQuestParser(item_page_sources.owatankas_tailspike.classicdb);
            const result = parser.parse();
            expect(result).toBe("https://classic.wowhead.com/quest=884");
        });

        it("finds that an item does not start a quest from classicdb.ch item page source", async () => {
            const parser = new ClassicDBBeginsQuestParser(item_page_sources.shadowfang.classicdb);
            const result = parser.parse();
            expect(result).toBe("");
        });
    });

    describe("TBCDB", () => {
        it("finds that an item is part of a quest from tbcdb.com item page source", async () => {
            const parser = new IsPartOfQuestParser(item_page_sources.huge_gnoll_paw.tbcdb);
            const result = parser.parse();
            expect(result).toBe(true);
        });

        it("finds that an item is not part of a quest from tbcdb.com item page source", async () => {
            const parser = new IsPartOfQuestParser(item_page_sources.shadowfang.tbcdb);
            const result = parser.parse();
            expect(result).toBe(false);
        });

        it("finds that an item starts a quest from tbcdb.com item page source", async () => {
            const parser = new TBCDBBeginsQuestParser(item_page_sources.owatankas_tailspike.tbcdb);
            const result = parser.parse();
            expect(result).toBe("https://tbc.wowhead.com/quest=884");
        });

        it("finds that an item does not start a quest from tbcdb.com item page source", async () => {
            const parser = new TBCDBBeginsQuestParser(item_page_sources.shadowfang.tbcdb);
            const result = parser.parse();
            expect(result).toBe("");
        });
    });
});
