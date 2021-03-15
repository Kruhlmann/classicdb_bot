import { ItemStringFactory } from ".";
import { DamageType, DamageTypeLookupTable } from "../../parsers/damage_type";
import { capitalize_string } from "../../string";

export class DamageStringFactory extends ItemStringFactory {
    public build(): string {
        if (this.item.damage.dps === -1) {
            return "";
        }
        let result = "";
        result = this.add_only_physical_damage_ranges_to_result_text(result);
        result = this.add_non_physical_damage_ranges_to_result_text(result);
        return result;
    }

    private add_only_physical_damage_ranges_to_result_text(result: string): string {
        const phys_low = this.item.damage.damage_ranges[0].low;
        const phys_high = this.item.damage.damage_ranges[0].high;
        const dps_string = `(**${this.item.damage.dps}** damage per second)`;
        const swing_damage_string = `damage every **${this.item.damage.speed.toFixed(2)}** seconds`;
        result += `**+${phys_low} - ${phys_high}** ${swing_damage_string} ${dps_string}`;
        return result;
    }

    private add_non_physical_damage_ranges_to_result_text(result: string): string {
        for (const damage_range of this.item.damage.damage_ranges) {
            if (damage_range.type === DamageType.PHYSICAL) {
                continue;
            }
            const damage_type_string = new DamageTypeLookupTable().perform_reverse_lookup(damage_range.type);
            result += `\n**${damage_range.low} - ${damage_range.high}** ${capitalize_string(
                damage_type_string
            )} Damage`;
        }
        return result;
    }
}
