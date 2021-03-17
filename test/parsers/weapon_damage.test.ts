/// <reference types="jest" />
import { DamageType } from "../../src/parsers/damage_type";
import { WeaponDamageParser } from "../../src/parsers/weapon_damage";
import { item_page_sources } from "../resources";

const empty_weapon_damage_parse_result = {
    dps: -1,
    damage_ranges: [{ low: -1, high: -1, type: DamageType.NONE }],
    speed: -1,
};
const thunderfury_weapon_damage_parse_result = {
    dps: 53.9,
    damage_ranges: [
        { low: 44, high: 115, type: DamageType.PHYSICAL },
        { low: 16, high: 30, type: DamageType.NATURE },
    ],
    speed: 1.9,
};

describe("Weapon damage parser", () => {
    describe("ClassicDB", () => {
        it("parses damage value status from classicdb.ch item page source", async () => {
            const parser = new WeaponDamageParser(item_page_sources.thunderfury.classicdb);
            const result = parser.parse();
            expect(result).toStrictEqual(thunderfury_weapon_damage_parse_result);
        });

        it("fails to parse status from item page source with no damage value", async () => {
            const parser = new WeaponDamageParser(item_page_sources.arcanist_belt.classicdb);
            const result = parser.parse();
            expect(result).toStrictEqual(empty_weapon_damage_parse_result);
        });
    });

    describe("TBCDB", () => {
        it("parses damage value status from tbcdb.com item page source", async () => {
            const parser = new WeaponDamageParser(item_page_sources.thunderfury.tbcdb);
            const result = parser.parse();
            expect(result).toStrictEqual(thunderfury_weapon_damage_parse_result);
        });

        it("fails to parse status from item page source with no damage value", async () => {
            const parser = new WeaponDamageParser(item_page_sources.arcanist_belt.tbcdb);
            const result = parser.parse();
            expect(result).toStrictEqual(empty_weapon_damage_parse_result);
        });
    });
});
