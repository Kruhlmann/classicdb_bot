import { Effect } from "../parser/effect";

/**
 * @fileoverview Type definitions.
 * @author Andreas Kruhlmann
 * @since 1.2.0
 */

export interface ParsedTooltip {
    effects: Effect[];
    stats: string[];
}

export interface SpellDetails {
    desc: string;
    name: string;
}

export interface ChannelIdentity {
    channel_name: string;
    guild_name: string;
}

export interface SetBonus {
    pieces_required: string;
    effect: Effect;
}

export enum CharacterClass {
    WARRIOR = "#C69B6D",
    PALADIN = "#F48CBA",
    HUNTER = "#AAD372",
    ROGUE = "#FFF468",
    PRIEST = "#FFFFFF",
    SHAMAN = "#2359FF",
    MAGE = "#68CCEF",
    WARLOCK = "#9382C9",
    DRUID = "#FF7C0A",
    NOCLASS = "",
}

export enum ItemBinding {
    ON_PICKUP = "Binds when picked up",
    ON_EQUIP = "Binds when equipped",
    NOBIND = "",
}

export enum ItemQuality {
    POOR = "#9D9D9D",
    COMMON = "#FFFFFF",
    UNCOMMON = "#1EFF00",
    RARE = "#0070DD",
    EPIC = "#A335EE",
    LEGENDARY = "#FF8000",
    ARTIFACT = "#E6CC80",
    BLIZZARD = "#00CCFF",
    NOQUALITY = "",
}
