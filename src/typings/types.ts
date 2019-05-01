/**
 * @fileoverview Type definitions.
 * @author Andreas Kruhlmann
 * @since 1.2.0
 */

export interface Item {
    id: string;
    href: string;
    name: string;
    quality: number;
    stats: string[];
    spells: Spell[];
    thumbnail: string;
}

export interface Spell {
    id: string;
    text: string;
    href: string;
    desc: string;
    name: string;
    thumbnail: string;
    trigger: string;
}

export interface ParsedTooltip {
    spells: Spell[];
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
