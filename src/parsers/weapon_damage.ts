import * as cheerio from "cheerio";

import { MonoRegexHTMLTooltipBodyParser, HTMLParser, MultiRegexHTMLTooltipBodyParser } from ".";
import { DamageType, DamageTypeLookupTable } from "./damage_type";

export type WeaponDamageRange = {
    low: number;
    high: number;
    type: DamageType | string;
};

export type WeaponDamage = {
    dps: number;
    damage_ranges: WeaponDamageRange[];
};

class WeaponDamagePerSecondParser extends MonoRegexHTMLTooltipBodyParser<number> {
    protected readonly pattern = /\((.*?) damage per second\)/;
    protected readonly default_value = -1;

    protected postformat(parse_result: string[]): number {
        return parseFloat(parse_result[1]);
    }
}

class WeaponPhysicalDamageRangeParser extends MonoRegexHTMLTooltipBodyParser<WeaponDamageRange> {
    protected readonly pattern = /([0-9]+) - ([0-9]+)\s+Damage/;
    protected readonly default_value = { low: -1, high: -1, type: DamageType.NONE };

    protected postformat(parse_result: string[]): WeaponDamageRange {
        const bottom_end_string = parse_result[1];
        const top_end_string = parse_result[2];
        return {
            low: parseInt(bottom_end_string),
            high: parseInt(top_end_string),
            type: DamageType.PHYSICAL,
        };
    }
}

class WeaponMagicDamageRangeParser extends MultiRegexHTMLTooltipBodyParser<WeaponDamageRange> {
    protected readonly pattern = /\+([0-9]+) - ([0-9]+) (.*?) Damage/g;

    protected postformat(parse_result: string[]): WeaponDamageRange | undefined {
        const bottom_end_string = parse_result[1];
        const top_end_string = parse_result[2];
        const damage_type = parse_result[3];

        return {
            low: parseInt(bottom_end_string),
            high: parseInt(top_end_string),
            type: new DamageTypeLookupTable().perform_lookup(damage_type),
        };
    }
}

export class WeaponDamageParser extends HTMLParser<WeaponDamage> {
    public parse(): WeaponDamage {
        const dps_parser = new WeaponDamagePerSecondParser(this.page_html_source);
        const physical_damage_parser = new WeaponPhysicalDamageRangeParser(this.page_html_source);
        const magic_damage_parser = new WeaponMagicDamageRangeParser(this.page_html_source);

        const physical_damage_range = physical_damage_parser.parse();
        const magic_damage_ranges = magic_damage_parser.parse();

        return {
            dps: dps_parser.parse(),
            damage_ranges: [physical_damage_range, ...magic_damage_ranges],
        };
    }
}
