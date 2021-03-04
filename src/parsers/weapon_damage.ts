import * as cheerio from "cheerio";

import { HTMLTooltipBodyParser, HTMLParser } from ".";

export enum DamageType {
    NONE,
    PHYSICAL,
    FIRE,
    FROST,
    ARCANE,
    NATURE,
    SHADOW,
    HOLY,
}

export type WeaponDamageRange = {
    low: number;
    high: number;
    type: DamageType | string;
};

export type WeaponDamage = {
    dps: number;
    damage_ranges: WeaponDamageRange[];
};

class WeaponDamagePerSecondParser extends HTMLTooltipBodyParser<number> {
    public static readonly weapon_dps_pattern = /\((.*?) damage per second\)/;
    public static readonly no_dps_value = -1;

    public async parse(): Promise<number> {
        const dps_pattern_match = this.tooltip_table_html.match(WeaponDamagePerSecondParser.weapon_dps_pattern);
        if (!dps_pattern_match || dps_pattern_match.length < 2) {
            return WeaponDamagePerSecondParser.no_dps_value;
        }
        const dps_value_string = dps_pattern_match[1];
        return parseFloat(dps_value_string);
    }
}

class WeaponPhysicalDamageRangeParser extends HTMLTooltipBodyParser<WeaponDamageRange> {
    public static readonly damage_range_pattern = /([0-9]+) - ([0-9]+) {2}Damage/;
    public static readonly no_damage_range_value: WeaponDamageRange = { low: -1, high: -1, type: DamageType.NONE };

    public async parse(): Promise<WeaponDamageRange> {
        const dmg_range_match = this.tooltip_table_html.match(WeaponPhysicalDamageRangeParser.damage_range_pattern);
        if (!dmg_range_match || dmg_range_match.length < 3) {
            return WeaponPhysicalDamageRangeParser.no_damage_range_value;
        }
        const bottom_end_string = dmg_range_match[1];
        const top_end_string = dmg_range_match[2];
        return {
            low: parseInt(bottom_end_string),
            high: parseInt(top_end_string),
            type: DamageType.PHYSICAL,
        };
    }
}

class WeaponMagicDamageRangeParser extends HTMLTooltipBodyParser<WeaponDamageRange[]> {
    public static readonly damage_range_pattern = /\+([0-9]+) - ([0-9]+) (.*?) Damage/g;
    public static readonly no_damage_range_value: WeaponDamageRange = { low: -1, high: -1, type: DamageType.NONE };

    public async parse(): Promise<WeaponDamageRange[]> {
        const damage_ranges: WeaponDamageRange[] = [];

        let dmg_range_match;
        do {
            dmg_range_match = WeaponMagicDamageRangeParser.damage_range_pattern.exec(this.tooltip_table_html);
            const damage_range = this.extract_damage_range_from_regex_match(dmg_range_match);
            if (damage_range) {
                damage_ranges.push(damage_range);
            }
        } while (dmg_range_match);

        return damage_ranges;
    }

    private extract_damage_range_from_regex_match(match: string[]): WeaponDamageRange | undefined {
        if (!match || match.length < 4) {
            return;
        }
        const bottom_end_string = match[1];
        const top_end_string = match[2];
        const damage_type = match[3];

        return {
            low: parseInt(bottom_end_string),
            high: parseInt(top_end_string),
            type: damage_type,
        };
    }
}

export class WeaponDamageParser extends HTMLParser<WeaponDamage> {
    public async parse(): Promise<WeaponDamage> {
        const dps_parser = new WeaponDamagePerSecondParser(this.page_html_source);
        const physical_damage_parser = new WeaponPhysicalDamageRangeParser(this.page_html_source);
        const magic_damage_parser = new WeaponMagicDamageRangeParser(this.page_html_source);

        const physical_damage_range = await physical_damage_parser.parse();
        const magic_damage_ranges = await magic_damage_parser.parse();

        return {
            dps: await dps_parser.parse(),
            damage_ranges: [physical_damage_range, ...magic_damage_ranges],
        };
    }
}
