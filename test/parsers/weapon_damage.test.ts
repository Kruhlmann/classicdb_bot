/// <reference types="jest" />
import { item_page_sources } from "../resources";
import { WeaponDamageParser, DamageType } from "../../src/parsers/weapon_damage";

const empty_weapon_damage_parse_result = {
    dps: -1,
    damage_ranges: [{ low: -1, high: -1, type: DamageType.NONE }],
};
const thunderfury_weapon_damage_parse_result = {
    dps: 53.9,
    damage_ranges: [
        { low: 44, high: 115, type: DamageType.PHYSICAL },
        { low: 16, high: 30, type: "Nature" },
    ],
};

describe("Weapon damage parser", () => {
    describe("ClassicDB", () => {
        it("parses damage value status from classicdb.ch item page source", async () => {
            const parser = new WeaponDamageParser(item_page_sources.thunderfury.classicdb);
            const result = await parser.parse();
            expect(result).toStrictEqual(thunderfury_weapon_damage_parse_result);
        });

        it("fails to parse status from item page source with no damage value", async () => {
            const parser = new WeaponDamageParser(item_page_sources.arcanist_belt.classicdb);
            const result = await parser.parse();
            expect(result).toStrictEqual(empty_weapon_damage_parse_result);
        });
    });

    describe("TBCDB", () => {
        it("parses damage value status from tbcdb.com item page source", async () => {
            const parser = new WeaponDamageParser(item_page_sources.thunderfury.tbcdb);
            const result = await parser.parse();
            expect(result).toStrictEqual(thunderfury_weapon_damage_parse_result);
        });

        it("fails to parse status from item page source with no damage value", async () => {
            const parser = new WeaponDamageParser(item_page_sources.arcanist_belt.tbcdb);
            const result = await parser.parse();
            expect(result).toStrictEqual(empty_weapon_damage_parse_result);
        });
    });
});
