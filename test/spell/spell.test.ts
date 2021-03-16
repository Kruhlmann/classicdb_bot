/// <reference types="jest" />
import { ClassicDBSpell, TBCDBSpell } from "../../src/spell";

describe("Spell", () => {
    describe("ClassicDB", () => {
        it("Recognizes a simple spell", () => {
            const simple_spell = new ClassicDBSpell(
                0,
                "",
                "",
                "",
                "https://classicdb.ch/images/icons/large/trade_engineering.jpg",
                ""
            );
            const complex_spell = new ClassicDBSpell(0, "", "", "", "", "");

            expect(simple_spell.is_simple).toBe(true);
            expect(complex_spell.is_simple).toBe(false);
        });
    });

    describe("TBCDB", () => {
        it("Recognizes a simple spell", () => {
            const simple_spell = new TBCDBSpell(0, "", "", "", "https://tbcdb.com/images/icons/large/temp.jpg", "");
            const complex_spell = new TBCDBSpell(0, "", "", "", "", "");

            expect(simple_spell.is_simple).toBe(true);
            expect(complex_spell.is_simple).toBe(false);
        });
    });
});
