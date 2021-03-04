/// <reference types="jest" />

import { DamageType, DamageTypeLookupTable } from "../../src/parsers/damage_type";

describe("Damage types", () => {
    describe("Lookup table", () => {
        it("returns the correct damage type from a string", async () => {
            const result = DamageTypeLookupTable.get_damage_type_from_string("ShAdOw");
            expect(result).toBe(DamageType.SHADOW);
        });

        it("returns physical damage type on an empty string", async () => {
            const result = DamageTypeLookupTable.get_damage_type_from_string("");
            expect(result).toBe(DamageType.PHYSICAL);
        });

        it("returns none damage type on undefined input", async () => {
            const result = DamageTypeLookupTable.get_damage_type_from_string();
            expect(result).toBe(DamageType.NONE);
        });

        it("returns none damage type on invalid input", async () => {
            const result = DamageTypeLookupTable.get_damage_type_from_string("not a damage type");
            expect(result).toBe(DamageType.NONE);
        });
    });
});
