/// <reference types="jest" />
import { ClassicDBSpellParser, TBCDBSpellParser } from "../../src/parsers/spell";
import { item_page_sources } from "../resources";

describe("Spell parser", () => {
    describe("ClassicDB", () => {
        it("parses spell from classicdb.ch item page source", async () => {
            let parser = new ClassicDBSpellParser(item_page_sources.deaths_sting.classicdb);
            let result = parser.parse();
            expect(result).toStrictEqual([
                { id: 15808, trigger: "Equip", description: "+38 Attack Power." },
                { id: 7574, trigger: "Equip", description: "Increased Daggers +3." },
            ]);

            parser = new ClassicDBSpellParser(item_page_sources.barrel.classicdb);
            result = parser.parse();
            expect(result).toStrictEqual([]);
        });
    });

    describe("TBCDB", () => {
        it("parses spell from tbcdb.com item page source", async () => {
            let parser = new TBCDBSpellParser(item_page_sources.deaths_sting.tbcdb);
            let result = parser.parse();
            expect(result).toStrictEqual([
                { id: -1, trigger: "Equip", description: "Increases your expertise rating by 7." },
                { id: 15808, trigger: "Equip", description: "Increases attack power by 38." },
            ]);

            parser = new TBCDBSpellParser(item_page_sources.barrel.tbcdb);
            result = parser.parse();
            expect(result).toStrictEqual([]);
        });
    });
});
