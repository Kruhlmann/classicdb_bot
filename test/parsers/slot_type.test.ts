/// <reference types="jest" />
import { item_page_sources } from "../resources";
import { SlotTypeParser, Slot, Type } from "../../src/parsers/slot_type";

describe("Slot type parser", () => {
    describe("ClassicDB", () => {
        describe("Slots", () => {
            it("parses main hand weapon from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.quelserrar.classicdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.MAIN_HAND);
            });

            it("parses off hand weapon from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.warblade_of_the_hakkari.classicdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.OFF_HAND);
            });

            it("parses one-handed weapon from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.thunderfury.classicdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.ONE_HAND);
            });

            it("parses two-handed weapon from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.the_untamed_blade.classicdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.TWO_HAND);
            });

            it("parses helmet from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.lionheart_helmet.classicdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.HEAD);
            });

            it("parses necklace from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.onyxia_tooth_pendant.classicdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.NECK);
            });

            it("parses shoulders from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.truestrike_shoulders.classicdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.SHOULDER);
            });

            it("parses cloak from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.glacial_cloak.classicdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.BACK);
            });

            it("parses chest from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.thorium_armor.classicdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.CHEST);
            });

            it("parses shirt from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.stylish_shirt.classicdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.SHIRT);
            });

            it("parses tabard from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.arathor_tabard.classicdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.TABARD);
            });

            it("parses bracers from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.cryptstalker_wristguards.classicdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.WRIST);
            });

            it("parses held in off-hand from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.tome_of_knowledge.classicdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.HELD_IN_OFF_HAND);
            });

            it("parses ranged weapon from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.satyrs_bow.classicdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.RANGED);
            });

            it("parses thrown from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.flightblade_throwing_axe.classicdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.THROWN);
            });

            it("parses projectile from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.ice_threaded_bullet.classicdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.PROJECTILE);
            });

            it("parses relic from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.idol_of_brutality.classicdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.RELIC);
            });

            it("parses hands from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.dreadnaught_gauntlets.classicdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.HANDS);
            });

            it("parses belt from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.arcanist_belt.classicdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.WAIST);
            });

            it("parses legs from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.legplates_of_carnage.classicdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.LEGS);
            });

            it("parses feet from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.chromatic_boots.classicdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.FEET);
            });

            it("parses finger from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.cenarius.classicdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.FINGER);
            });

            it("parses trinket from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.drake_fang_talisman.classicdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.TRINKET);
            });

            it("parses nothing from empty item page source", async () => {
                const parser = new SlotTypeParser("");
                const result = parser.parse();
                expect(result.slot).toBe(Slot.NONE);
            });
        });

        describe("Types", () => {
            it("parses plate from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.lionheart_helmet.classicdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.PLATE);
            });

            it("parses mail from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.edgemasters_handguards.classicdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.MAIL);
            });

            it("parses leather from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.truestrike_shoulders.classicdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.LEATHER);
            });

            it("parses cloth from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.glacial_cloak.classicdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.CLOTH);
            });

            it("parses sword from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.thunderfury.classicdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.SWORD);
            });

            it("parses axe from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.dooms_edge.classicdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.AXE);
            });

            it("parses mace from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.lokamir.classicdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.MACE);
            });

            it("parses dagger from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.deaths_sting.classicdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.DAGGER);
            });

            it("parses wand from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.greater_magic_wand.classicdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.WAND);
            });

            it("parses idol from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.idol_of_brutality.classicdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.IDOL);
            });

            it("parses libram from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.libram_of_light.classicdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.LIBRAM);
            });

            it("parses totem from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.totem_of_the_storm.classicdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.TOTEM);
            });

            it("parses thrown from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.flightblade_throwing_axe.classicdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.THROWN);
            });

            it("parses shield from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.skullflame_shield.classicdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.SHIELD);
            });

            it("parses fist weapon from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.claw_of_the_frost_wyrm.classicdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.FIST_WEAPON);
            });

            it("parses staff from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.staff_of_jordan.classicdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.STAFF);
            });

            it("parses gun from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.larvae_of_the_great_worm.classicdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.GUN);
            });

            it("parses bow from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.satyrs_bow.classicdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.BOW);
            });

            it("parses crossbow from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.heartseeking_crossbow.classicdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.CROSSBOW);
            });

            it("parses bullet from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.ice_threaded_bullet.classicdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.BULLET);
            });

            it("parses arrow from classicdb.ch item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.jagged_arrow.classicdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.ARROW);
            });
        });
    });

    describe("TBCDB", () => {
        describe("Slots", () => {
            it("parses main hand weapon from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.lokamir.tbcdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.MAIN_HAND);
            });

            it("parses off hand weapon from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.warblade_of_the_hakkari.tbcdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.OFF_HAND);
            });

            it("parses one-handed weapon from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.thunderfury.tbcdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.ONE_HAND);
            });

            it("parses two-handed weapon from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.the_untamed_blade.tbcdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.TWO_HAND);
            });

            it("parses helmet from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.lionheart_helmet.tbcdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.HEAD);
            });

            it("parses necklace from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.onyxia_tooth_pendant.tbcdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.NECK);
            });

            it("parses shoulders from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.truestrike_shoulders.tbcdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.SHOULDER);
            });

            it("parses cloak from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.glacial_cloak.tbcdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.BACK);
            });

            it("parses chest from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.thorium_armor.tbcdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.CHEST);
            });

            it("parses shirt from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.stylish_shirt.tbcdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.SHIRT);
            });

            it("parses tabard from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.arathor_tabard.tbcdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.TABARD);
            });

            it("parses bracers from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.cryptstalker_wristguards.tbcdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.WRIST);
            });

            it("parses held in off-hand from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.tome_of_knowledge.tbcdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.HELD_IN_OFF_HAND);
            });

            it("parses ranged weapon from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.satyrs_bow.tbcdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.RANGED);
            });

            it("parses thrown from tbcdb.com item page source", async () => {
                // TBCDB does not show the thrown category.
                const parser = new SlotTypeParser(item_page_sources.flightblade_throwing_axe.tbcdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.NONE);
            });

            it("parses projectile from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.ice_threaded_bullet.tbcdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.PROJECTILE);
            });

            it("parses relic from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.idol_of_brutality.tbcdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.RELIC);
            });

            it("parses hands from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.dreadnaught_gauntlets.tbcdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.HANDS);
            });

            it("parses belt from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.arcanist_belt.tbcdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.WAIST);
            });

            it("parses legs from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.legplates_of_carnage.tbcdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.LEGS);
            });

            it("parses feet from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.chromatic_boots.tbcdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.FEET);
            });

            it("parses finger from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.cenarius.tbcdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.FINGER);
            });

            it("parses trinket from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.drake_fang_talisman.tbcdb);
                const result = parser.parse();
                expect(result.slot).toBe(Slot.TRINKET);
            });

            it("parses nothing from empty item page source", async () => {
                const parser = new SlotTypeParser("");
                const result = parser.parse();
                expect(result.slot).toBe(Slot.NONE);
            });
        });

        describe("Types", () => {
            it("parses plate from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.lionheart_helmet.tbcdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.PLATE);
            });

            it("parses mail from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.edgemasters_handguards.tbcdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.MAIL);
            });

            it("parses leather from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.truestrike_shoulders.tbcdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.LEATHER);
            });

            it("parses cloth from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.glacial_cloak.tbcdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.CLOTH);
            });

            it("parses sword from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.thunderfury.tbcdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.SWORD);
            });

            it("parses axe from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.dooms_edge.tbcdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.AXE);
            });

            it("parses mace from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.lokamir.tbcdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.MACE);
            });

            it("parses dagger from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.deaths_sting.tbcdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.DAGGER);
            });

            it("parses wand from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.greater_magic_wand.tbcdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.WAND);
            });

            it("parses idol from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.idol_of_brutality.tbcdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.IDOL);
            });

            it("parses libram from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.libram_of_light.tbcdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.LIBRAM);
            });

            it("parses totem from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.totem_of_the_storm.tbcdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.TOTEM);
            });

            it("parses thrown from tbcdb.com item page source", async () => {
                // TBCDB does not show the thrown category.
                const parser = new SlotTypeParser(item_page_sources.flightblade_throwing_axe.tbcdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.NONE);
            });

            it("parses shield from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.skullflame_shield.tbcdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.SHIELD);
            });

            it("parses fist weapon from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.claw_of_the_frost_wyrm.tbcdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.FIST_WEAPON);
            });

            it("parses staff from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.staff_of_jordan.tbcdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.STAFF);
            });

            it("parses gun from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.larvae_of_the_great_worm.tbcdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.GUN);
            });

            it("parses bow from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.satyrs_bow.tbcdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.BOW);
            });

            it("parses crossbow from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.heartseeking_crossbow.tbcdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.CROSSBOW);
            });

            it("parses bullet from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.ice_threaded_bullet.tbcdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.BULLET);
            });

            it("parses arrow from tbcdb.com item page source", async () => {
                const parser = new SlotTypeParser(item_page_sources.jagged_arrow.tbcdb);
                const result = parser.parse();
                expect(result.type).toBe(Type.ARROW);
            });
        });
    });
});
