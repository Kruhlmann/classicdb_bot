import { LookupTable } from "./lookup_table";

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

export class DamageTypeLookupTable extends LookupTable<DamageType> {
    protected lookup_table: Record<string, DamageType> = {
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
    protected default_value = DamageType.NONE;
}
