import { HTMLParser, MonoRegexHTMLTooltipBodyParser, MultiRegexHTMLTooltipBodyParser } from ".";
import { DamageType, DamageTypeLookupTable } from "./damage_type";

export interface WeaponDamageRange {
    low: number;
    high: number;
    type: DamageType;
}

export interface WeaponDamage {
    dps: number;
    damage_ranges: WeaponDamageRange[];
    speed: number;
}

class WeaponDamagePerSecondParser extends MonoRegexHTMLTooltipBodyParser<number> {
    protected readonly pattern = /\((.*?) damage per second\)/;
    protected readonly default_value = -1;

    protected postformat(parse_result: string[]): number {
        return Number.parseFloat(parse_result[1]);
    }
}

class WeaponSpeedParser extends MonoRegexHTMLTooltipBodyParser<number> {
    protected readonly pattern = /Speed (\d\.\d\d)/;
    protected readonly default_value = -1;

    protected postformat(parse_result: string[]): number {
        return Number.parseFloat(parse_result[1]);
    }
}

class WeaponPhysicalDamageRangeParser extends MonoRegexHTMLTooltipBodyParser<WeaponDamageRange> {
    protected readonly pattern = /(\d+) - (\d+)\s+Damage/;
    protected readonly default_value = { low: -1, high: -1, type: DamageType.NONE };

    protected postformat(parse_result: string[]): WeaponDamageRange {
        const bottom_end_string = parse_result[1];
        const top_end_string = parse_result[2];
        return {
            low: Number.parseInt(bottom_end_string),
            high: Number.parseInt(top_end_string),
            type: DamageType.PHYSICAL,
        };
    }
}

class WeaponMagicDamageRangeParser extends MultiRegexHTMLTooltipBodyParser<WeaponDamageRange> {
    protected readonly pattern = /\+(\d+) - (\d+) (.*?) Damage/g;

    protected postformat(parse_result: string[]): WeaponDamageRange | undefined {
        const bottom_end_string = parse_result[1];
        const top_end_string = parse_result[2];
        const damage_type = parse_result[3];

        return {
            low: Number.parseInt(bottom_end_string),
            high: Number.parseInt(top_end_string),
            type: new DamageTypeLookupTable().perform_lookup(damage_type),
        };
    }
}

export class WeaponDamageParser extends HTMLParser<WeaponDamage> {
    public parse(): WeaponDamage {
        const dps_parser = new WeaponDamagePerSecondParser(this.page_html_source);
        const physical_damage_parser = new WeaponPhysicalDamageRangeParser(this.page_html_source);
        const magic_damage_parser = new WeaponMagicDamageRangeParser(this.page_html_source);
        const speed_parser = new WeaponSpeedParser(this.page_html_source);

        const physical_damage_range = physical_damage_parser.parse();
        const magic_damage_ranges = magic_damage_parser.parse();
        const weapon_speed = speed_parser.parse();

        return {
            dps: dps_parser.parse(),
            damage_ranges: [physical_damage_range, ...magic_damage_ranges],
            speed: weapon_speed,
        };
    }
}
