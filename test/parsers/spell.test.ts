/// <reference types="jest" />
import { item_page_sources } from "../resources";
import { SpellParser } from "../../src/parsers/spell";

describe("Spell parser", () => {
    describe("ClassicDB", () => {
        it("parses spell from classicdb.ch item page source", async () => {
            let parser = new SpellParser(item_page_sources.deaths_sting.classicdb);
            let result = parser.parse();
            expect(result).toStrictEqual([
                { id: 15808, trigger: "Equip", description: "+38 Attack Power." },
                { id: 7574, trigger: "Equip", description: "Increased Daggers +3." },
            ]);

            //parser = new ArmorValueParser(item_page_sources.the_hungering_cold.classicdb);
            //result = parser.parse();
            //expect(result).toBe(140);
        });

        //it("fails to parse spell from item page source with no spells", async () => {
        //const parser = new ArmorValueParser(item_page_sources.thunderfury.classicdb);
        //const result = parser.parse();
        //expect(result).toBe(-1);
        //});
        //});

        //describe("TBCDB", () => {
        //it("parses spell from tbcdb.com item page source", async () => {
        //let parser = new ArmorValueParser(item_page_sources.arcanist_belt.tbcdb);
        //let result = parser.parse();
        //expect(result).toBe(65);

        //parser = new ArmorValueParser(item_page_sources.the_hungering_cold.tbcdb);
        //result = parser.parse();
        //expect(result).toBe(140);
        //});

        //it("fails to parse spell from item page source with no spells", async () => {
        //const parser = new ArmorValueParser(item_page_sources.thunderfury.tbcdb);
        //const result = parser.parse();
        //expect(result).toBe(-1);
        //});
    });
});
