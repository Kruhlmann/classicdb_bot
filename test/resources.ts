import * as fs from "fs";

export const simple_spell_thumbnail_url = {
    classicdb: "https://classicdb.ch/images/icons/large/trade_engineering.jpg",
    tbcdb: "https://tbcdb.com/images/icons/large/temp.jpg",
};
export const item_page_sources = {
    audacity: {
        classicdb: fs.readFileSync("res/test/items/classicdb_alexs_ring_of_audacity_item_page.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_alexs_ring_of_audacity_item_page.html").toString(),
    },
    thunderfury: {
        classicdb: fs.readFileSync("res/test/items/classicdb_thunderfury_item_page.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_thunderfury_item_page.html").toString(),
    },
    quelserrar: {
        classicdb: fs.readFileSync("res/test/items/classicdb_quelserrar_item_page.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_quelserrar_item_page.html").toString(),
    },
    cenarius: {
        classicdb: fs.readFileSync("res/test/items/classicdb_band_of_cenarius.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_band_of_cenarius.html").toString(),
    },
    shadowfang: {
        classicdb: fs.readFileSync("res/test/items/classicdb_shadowfang.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_shadowfang.html").toString(),
    },
    nozdormu: {
        classicdb: fs.readFileSync("res/test/items/classicdb_agent_of_nozdormu.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_agent_of_nozdormu.html").toString(),
    },
    bloodcap: {
        classicdb: fs.readFileSync("res/test/items/classicdb_bloodcap.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_bloodcap.html").toString(),
    },
    barrel: {
        classicdb: fs.readFileSync("res/test/items/classicdb_empty_barrel.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_empty_barrel.html").toString(),
    },
    arcanist_belt: {
        classicdb: fs.readFileSync("res/test/items/classicdb_arcanist_belt.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_arcanist_belt.html").toString(),
    },
    the_hungering_cold: {
        classicdb: fs.readFileSync("res/test/items/classicdb_the_hungering_cold.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_the_hungering_cold.html").toString(),
    },
    skullflame_shield: {
        classicdb: fs.readFileSync("res/test/items/classicdb_skullflame_shield.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_skullflame_shield.html").toString(),
    },
    tome_of_knowledge: {
        classicdb: fs.readFileSync("res/test/items/classicdb_tome_of_knowledge.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_tome_of_knowledge.html").toString(),
    },
    thorium_armor: {
        classicdb: fs.readFileSync("res/test/items/classicdb_thorium_armor.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_thorium_armor.html").toString(),
    },
    shriveled_heart: {
        classicdb: fs.readFileSync("res/test/items/classicdb_shriveled_heart.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_shriveled_heart.html").toString(),
    },
    huge_gnoll_paw: {
        classicdb: fs.readFileSync("res/test/items/classicdb_huge_gnoll_paw.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_huge_gnoll_paw.html").toString(),
    },
    owatankas_tailspike: {
        classicdb: fs.readFileSync("res/test/items/classicdb_owatankas_tailspike.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_owatankas_tailspike.html").toString(),
    },
    the_untamed_blade: {
        classicdb: fs.readFileSync("res/test/items/classicdb_the_untamed_blade.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_the_untamed_blade.html").toString(),
    },
    warblade_of_the_hakkari: {
        classicdb: fs.readFileSync("res/test/items/classicdb_warblade_of_the_hakkari.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_warblade_of_the_hakkari.html").toString(),
    },
    lokamir: {
        classicdb: fs.readFileSync("res/test/items/classicdb_lokamir.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_lokamir.html").toString(),
    },
    lionheart_helmet: {
        classicdb: fs.readFileSync("res/test/items/classicdb_lionheart_helmet.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_lionheart_helmet.html").toString(),
    },
    onyxia_tooth_pendant: {
        classicdb: fs.readFileSync("res/test/items/classicdb_onyxia_tooth_pendant.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_onyxia_tooth_pendant.html").toString(),
    },
    truestrike_shoulders: {
        classicdb: fs.readFileSync("res/test/items/classicdb_truestrike_shoulders.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_truestrike_shoulders.html").toString(),
    },
    glacial_cloak: {
        classicdb: fs.readFileSync("res/test/items/classicdb_glacial_cloak.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_glacial_cloak.html").toString(),
    },
    stylish_shirt: {
        classicdb: fs.readFileSync("res/test/items/classicdb_stylish_shirt.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_stylish_shirt.html").toString(),
    },
    cryptstalker_wristguards: {
        classicdb: fs.readFileSync("res/test/items/classicdb_cryptstalker_wristguards.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_cryptstalker_wristguards.html").toString(),
    },
    satyrs_bow: {
        classicdb: fs.readFileSync("res/test/items/classicdb_satyrs_bow.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_satyrs_bow.html").toString(),
    },
    flightblade_throwing_axe: {
        classicdb: fs.readFileSync("res/test/items/classicdb_flightblade_throwing_axe.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_flightblade_throwing_axe.html").toString(),
    },
    ice_threaded_bullet: {
        classicdb: fs.readFileSync("res/test/items/classicdb_ice_threaded_bullet.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_ice_threaded_bullet.html").toString(),
    },
    idol_of_brutality: {
        classicdb: fs.readFileSync("res/test/items/classicdb_idol_of_brutality.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_idol_of_brutality.html").toString(),
    },
    libram_of_light: {
        classicdb: fs.readFileSync("res/test/items/classicdb_libram_of_light.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_libram_of_light.html").toString(),
    },
    dreadnaught_gauntlets: {
        classicdb: fs.readFileSync("res/test/items/classicdb_dreadnaught_gauntlets.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_dreadnaught_gauntlets.html").toString(),
    },
    legplates_of_carnage: {
        classicdb: fs.readFileSync("res/test/items/classicdb_legplates_of_carnage.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_legplates_of_carnage.html").toString(),
    },
    chromatic_boots: {
        classicdb: fs.readFileSync("res/test/items/classicdb_chromatic_boots.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_chromatic_boots.html").toString(),
    },
    drake_fang_talisman: {
        classicdb: fs.readFileSync("res/test/items/classicdb_drake_fang_talisman.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_drake_fang_talisman.html").toString(),
    },
    edgemasters_handguards: {
        classicdb: fs.readFileSync("res/test/items/classicdb_edgemasters_handguards.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_edgemasters_handguards.html").toString(),
    },
    dooms_edge: {
        classicdb: fs.readFileSync("res/test/items/classicdb_dooms_edge.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_dooms_edge.html").toString(),
    },
    deaths_sting: {
        classicdb: fs.readFileSync("res/test/items/classicdb_deaths_sting.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_deaths_sting.html").toString(),
    },
    greater_magic_wand: {
        classicdb: fs.readFileSync("res/test/items/classicdb_greater_magic_wand.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_greater_magic_wand.html").toString(),
    },
    totem_of_the_storm: {
        classicdb: fs.readFileSync("res/test/items/classicdb_totem_of_the_storm.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_totem_of_the_storm.html").toString(),
    },
    claw_of_the_frost_wyrm: {
        classicdb: fs.readFileSync("res/test/items/classicdb_claw_of_the_frost_wyrm.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_claw_of_the_frost_wyrm.html").toString(),
    },
    staff_of_jordan: {
        classicdb: fs.readFileSync("res/test/items/classicdb_staff_of_jordan.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_staff_of_jordan.html").toString(),
    },
    larvae_of_the_great_worm: {
        classicdb: fs.readFileSync("res/test/items/classicdb_larvae_of_the_great_worm.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_larvae_of_the_great_worm.html").toString(),
    },
    heartseeking_crossbow: {
        classicdb: fs.readFileSync("res/test/items/classicdb_heartseeking_crossbow.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_heartseeking_crossbow.html").toString(),
    },
    jagged_arrow: {
        classicdb: fs.readFileSync("res/test/items/classicdb_jagged_arrow.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_jagged_arrow.html").toString(),
    },
    arathor_battle_tabard: {
        classicdb: fs.readFileSync("res/test/items/classicdb_arathor_battle_tabard.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_arathor_battle_tabard.html").toString(),
    },
    scryers_bloodgem: {
        classicdb: "",
        tbcdb: fs.readFileSync("res/test/items/tbcdb_scryers_bloodgem.html").toString(),
    },
    heavy_mageweave_bandage: {
        classicdb: fs.readFileSync("res/test/items/classicdb_heavy_mageweave_bandage.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_heavy_mageweave_bandage.html").toString(),
    },
    reins_of_the_black_war_tiger: {
        classicdb: fs.readFileSync("res/test/items/classicdb_reins_of_the_black_war_tiger.html").toString(),
        tbcdb: fs.readFileSync("res/test/items/tbcdb_reins_of_the_black_war_tiger.html").toString(),
    },
};
export const spell_page_sources = {
    thunderfury: {
        classicdb: fs.readFileSync("res/test/spells/classicdb_thunderfury.html").toString(),
        tbcdb: fs.readFileSync("res/test/spells/tbcdb_thunderfury.html").toString(),
    },
    attack_power_38: {
        classicdb: fs.readFileSync("res/test/spells/classicdb_38_ap.html").toString(),
        tbcdb: fs.readFileSync("res/test/spells/tbcdb_38_ap.html").toString(),
    },
    deathbringer_shadow_bolt: {
        classicdb: fs.readFileSync("res/test/spells/classicdb_deathbringer_shadow_bolt.html").toString(),
        tbcdb: fs.readFileSync("res/test/spells/tbcdb_deathbringer_shadow_bolt.html").toString(),
    },
};
