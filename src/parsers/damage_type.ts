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

export class DamageTypeLookupTable {
    private static lookup_table: Record<string, DamageType> = {
        // If no damage type is specified that means the damage is physical.
        [""]: DamageType.PHYSICAL,
        none: DamageType.NONE,
        fire: DamageType.FIRE,
        frost: DamageType.FROST,
        arcane: DamageType.ARCANE,
        nature: DamageType.NATURE,
        shadow: DamageType.SHADOW,
        holy: DamageType.HOLY,
    };

    public static get_damage_type_from_string(damage_type_string?: string): DamageType {
        if (damage_type_string === undefined) {
            return DamageType.NONE;
        }
        const lowercase_damage_type_string = damage_type_string.toLowerCase();
        const type = DamageTypeLookupTable.lookup_table[lowercase_damage_type_string];
        if (!type) {
            return DamageType.NONE;
        }
        return type;
    }
}
