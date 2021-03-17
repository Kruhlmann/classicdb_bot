/// <reference types="jest" />
import { ClassicDBSpell, TBCDBSpell } from "../../src/spell";
import { simple_spell_thumbnail_url } from "../resources";

describe("Spell", () => {
    describe("ClassicDB", () => {
        it("Recognizes a simple spell", () => {
            const simple_spell = new ClassicDBSpell(0, "", "", "", simple_spell_thumbnail_url.classicdb, "");
            const complex_spell = new ClassicDBSpell(0, "", "", "", "", "");

            expect(simple_spell.is_simple).toBe(true);
            expect(complex_spell.is_simple).toBe(false);
        });
    });

    describe("TBCDB", () => {
        it("Recognizes a simple spell", () => {
            const simple_spell = new TBCDBSpell(0, "", "", "", simple_spell_thumbnail_url.tbcdb, "");
            const complex_spell = new TBCDBSpell(0, "", "", "", "", "");

            expect(simple_spell.is_simple).toBe(true);
            expect(complex_spell.is_simple).toBe(false);
        });
    });
});
