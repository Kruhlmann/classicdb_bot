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
    WARRIOR = "[Warrior](https://classic.wowhead.com/warrior)",
    PALADIN = "[Paladin](https://classic.wowhead.com/paladin)",
    HUNTER = "[Hunter](https://classic.wowhead.com/hunter)",
    ROGUE = "[Rogue](https://classic.wowhead.com/rogue)",
    PRIEST = "[Priest](https://classic.wowhead.com/priest)",
    SHAMAN = "[Shaman](https://classic.wowhead.com/shaman)",
    MAGE = "[Mage](https://classic.wowhead.com/mage)",
    WARLOCK = "[Warlock](https://classic.wowhead.com/warlock)",
    DRUID = "[Druid](https://classic.wowhead.com/druid)",
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
