/// <reference types="jest" />
import { ClassicDBPreResolvedSpellParser, TBCDBPreResolvedSpellParser } from "../../src/parsers/spell";
import { item_page_sources } from "../resources";

describe("Spell parser", () => {
    describe("ClassicDB", () => {
        it("parses spell from classicdb.ch item page source", async () => {
            const parser = new ClassicDBPreResolvedSpellParser(item_page_sources.deaths_sting.classicdb);
            const result = parser.parse();
            expect(result).toStrictEqual([
                { id: 15808, trigger: "Equip", description: "+38 Attack Power." },
                { id: 7574, trigger: "Equip", description: "Increased Daggers +3." },
            ]);
        });
        it("parses empty spell set from classicdb.ch item page source without spells", async () => {
            const parser = new ClassicDBPreResolvedSpellParser(item_page_sources.barrel.classicdb);
            const result = parser.parse();
            expect(result).toStrictEqual([]);
        });
    });

    describe("TBCDB", () => {
        it("parses spell from tbcdb.com item page source", async () => {
            const parser = new TBCDBPreResolvedSpellParser(item_page_sources.deaths_sting.tbcdb);
            const result = parser.parse();
            expect(result).toStrictEqual([
                { id: -1, trigger: "Equip", description: "Increases your expertise rating by 7." },
                { id: 15808, trigger: "Equip", description: "Increases attack power by 38." },
            ]);
        });

        it("parses empty spell set from tbcdb.com item page source without spells", async () => {
            const parser = new TBCDBPreResolvedSpellParser(item_page_sources.barrel.tbcdb);
            const result = parser.parse();
            expect(result).toStrictEqual([]);
        });
    });
});
