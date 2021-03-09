/// <reference types="jest" />
import { item_page_sources } from "../resources";
import { Attribute, AttributeParser } from "../../src/parsers/attributes";

const thorium_armor_parse_result = [
    { type: Attribute.FIRE_RESISTANCE, value: 8 },
    { type: Attribute.NATURE_RESISTANCE, value: 8 },
    { type: Attribute.FROST_RESISTANCE, value: 8 },
    { type: Attribute.SHADOW_RESISTANCE, value: 8 },
    { type: Attribute.ARCANE_RESISTANCE, value: 8 },
];
const tome_of_knowledge_parse_result = [
    { type: Attribute.AGILITY, value: 8 },
    { type: Attribute.STRENGTH, value: 8 },
    { type: Attribute.INTELLECT, value: 8 },
    { type: Attribute.SPIRIT, value: 8 },
    { type: Attribute.STAMINA, value: 8 },
];
const shriveled_heart_parse_result = [
    { type: Attribute.SPIRIT, value: -5 },
    { type: Attribute.STRENGTH, value: -5 },
    { type: Attribute.STAMINA, value: 13 },
];

describe("Weapon damage parser", () => {
    describe("ClassicDB", () => {
        it("parses stat attributes from classicdb.ch item page source", async () => {
            const parser = new AttributeParser(item_page_sources.tome_of_knowledge.classicdb);
            const result = parser.parse();
            expect(result).toStrictEqual(tome_of_knowledge_parse_result);
        });

        it("parses negative stat attributes from classicdb.ch item page source", async () => {
            const parser = new AttributeParser(item_page_sources.shriveled_heart.classicdb);
            const result = parser.parse();
            expect(result).toStrictEqual(shriveled_heart_parse_result);
        });

        it("parses resistance attributes from classicdb.ch item page source", async () => {
            const parser = new AttributeParser(item_page_sources.thorium_armor.classicdb);
            const result = parser.parse();
            expect(result).toStrictEqual(thorium_armor_parse_result);
        });

        it("fails to parse status from item page source with no attributes", async () => {
            const parser = new AttributeParser(item_page_sources.barrel.classicdb);
            const result = parser.parse();
            expect(result).toStrictEqual([]);
        });
    });

    //describe("TBCDB", () => {
    //it("parses damage value status from tbcdb.com item page source", async () => {
    //const parser = new AttributeParser(item_page_sources.thunderfury.tbcdb);
    //const result = parser.parse();
    //expect(result).toStrictEqual(tome_of_knowledge_parse_result);
    //});

    //it("fails to parse status from item page source with no damage value", async () => {
    //const parser = new AttributeParser(item_page_sources.arcanist_belt.tbcdb);
    //const result = parser.parse();
    //expect(result).toStrictEqual(empty_weapon_damage_parse_result);
    //});
    //});
});
