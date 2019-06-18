/**
 * @fileoverview Type definitions.
 * @author Andreas Kruhlmann
 * @since 1.2.0
 */

import { RichEmbed } from "discord.js";
import { Effect } from "../parsers/effect";

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

export interface ParserQuery {
    item_identifier: string;
    item_version: string;
}

export interface Parser {
    readonly host: string;
    respond_to: (query: ParserQuery) => Promise<RichEmbed[]>;
}

export interface QuestImplementable {
    id: string;
    name: string;
    href: string;
}

export interface ItemImplementable {
    // Required properties.
    id: string;
    name: string;
    href: string;
    thumbnail_href: string;
    quality_color: string;
    unique: boolean;
    binds_on: ItemBinding;

    // Optional properties
    begins_quest?: QuestImplementable;
    class_restrictions?: CharacterClass[];
    level_requirement?: number;
    durability?: number;
    primary_stats?: string[];
    effects?: Effect[];
    armor?: number;
    equipment_slot?: string;
    equipment_type?: string;
    damage_range?: {low: number, high: number};
    swing_speed?: number;
    dps?: number;
    flavor_text?: string;
}

export enum Operator {
    OR,
    AND,
}

export enum LoggingLevel {
    DEV = 0,
    INF = 1,
    WAR = 2,
    ERR = 3,
}
