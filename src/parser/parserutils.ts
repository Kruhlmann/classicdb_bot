import { ItemBinding } from "../typings/types";
import { weapon_types, weapon_slots_suffixes } from "../consts";


export function item_binding_to_str(binding: ItemBinding): string {
    switch (binding) {
        case ItemBinding.ON_PICKUP:
            return "Binds when picked up";
        case ItemBinding.ON_EQUIP:
            return "Binds when equipped";
        default:
            return null;
    }
}

/**
 * Returns a single-element array with a formatted equipment string based on the
 * equipment type and it's slot.
 *
 * @param {string} slot - Item slot.
 * @param {string} equipment_type - Equipment type.
 * @returns {string[]} - Single-element array containing the formatted string.
 * If the item did not exist in the weapon types an empty array is returned.
 */
export function equipment_str(slot: string, equipment_type: string): string[] {
    if (weapon_types.includes(equipment_type.toLowerCase())) {
        return weapon_slots_suffixes.includes(slot.toLowerCase())
            ? [`**${slot}ed ${equipment_type}**`]
            : [`**${slot ? `${slot} ` : " "}${equipment_type}**`];
    }
    return [];
}