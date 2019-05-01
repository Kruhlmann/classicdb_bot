/**
 * @fileoverview Application wide constants.
 * @author Andreas Kruhlmann
 * @since 1.2.0
 */

import * as cnf from "../config.json";

export const weapon_types = [
    "dagger",
    "mace",
    "sword",
    "wand",
    "staff",
    "polearm",
    "axe",
    "fishing pole",
    "fist weapon",
    "bow",
    "crossbow",
    "gun",
    "thrown",
    "miscellaneous",
    "held in off-hand",
    "shield",
];

export const weapon_slots_suffixes = [
    "two-hand",
    "one-hand",
];

export const armor_types = [
    "head",
    "neck",
    "shoulder",
    "chest",
    "hands",
    "wrist",
    "waist",
    "legs",
    "feet",
];

export const item_quality_colors: {[index: number]: number} = {
    6: 0xe5cc80, // Artifact
    5: 0xff8000, // Legendary
    4: 0xa335ee, // Epic.
    3: 0x0070dd, // Rare.
    2: 0x1EFF00, // Uncommon.
    1: 0x9d9d9d, // Poor.
};


export const favicon_path = "https://proxy.duckduckgo.com/iu/?u=http%3A%2F%2Forig08.deviantart.net%2F65e3%2Ff%2F2014%2F207%2Fe%2F2%2Fofficial_wow_icon_by_benashvili-d7sd1ab.png&f=1";
export const github_icon = "https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn4.iconfinder.com%2Fdata%2Ficons%2Ficonsimple-logotypes%2F512%2Fgithub-512.png&f=1";
export const github_href = "https://github.com/Kruhlmann/classicdb_bot";
export const misc_icon = `${cnf.host}/images/icons/large/trade_engineering.jpg`;
