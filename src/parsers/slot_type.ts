import { LookupTable } from "../lookup_table";
import { MonoRegexHTMLTooltipBodyParser } from ".";

export enum Slot {
    NONE,
    HEAD,
    NECK,
    SHOULDER,
    BACK,
    CHEST,
    SHIRT,
    TABARD,
    WRIST,
    MAIN_HAND,
    OFF_HAND,
    ONE_HAND,
    TWO_HAND,
    HELD_IN_OFF_HAND,
    RANGED,
    THROWN,
    PROJECTILE,
    RELIC,
    HANDS,
    WAIST,
    LEGS,
    FEET,
    FINGER,
    TRINKET,
}

export enum Type {
    NONE,
    PLATE,
    MAIL,
    LEATHER,
    CLOTH,
    SWORD,
    AXE,
    MACE,
    DAGGER,
    WAND,
    THROWN,
    IDOL,
    LIBRAM,
    TOTEM,
    SHIELD,
    FIST_WEAPON,
    STAFF,
    GUN,
    BOW,
    CROSSBOW,
    BULLET,
    ARROW,
}

export interface SlotType {
    slot: Slot;
    type: Type;
}

export class SlotLookupTable extends LookupTable<Slot> {
    protected lookup_table: Record<string, Slot> = {
        [""]: Slot.NONE,
        head: Slot.HEAD,
        neck: Slot.NECK,
        shoulder: Slot.SHOULDER,
        back: Slot.BACK,
        chest: Slot.CHEST,
        shirt: Slot.SHIRT,
        tabard: Slot.TABARD,
        wrist: Slot.WRIST,
        ["main hand"]: Slot.MAIN_HAND,
        ["one-hand"]: Slot.ONE_HAND,
        ["off hand"]: Slot.OFF_HAND,
        ["held in off-hand"]: Slot.HELD_IN_OFF_HAND,
        ["two-hand"]: Slot.TWO_HAND,
        ranged: Slot.RANGED,
        thrown: Slot.THROWN,
        projectile: Slot.PROJECTILE,
        relic: Slot.RELIC,
        hands: Slot.HANDS,
        waist: Slot.WAIST,
        legs: Slot.LEGS,
        feet: Slot.FEET,
        finger: Slot.FINGER,
        trinket: Slot.TRINKET,
    };
    protected default_value = Slot.NONE;
}

export class TypeLookupTable extends LookupTable<Type> {
    protected lookup_table: Record<string, Type> = {
        [""]: Type.NONE,
        plate: Type.PLATE,
        mail: Type.MAIL,
        leather: Type.LEATHER,
        cloth: Type.CLOTH,
        sword: Type.SWORD,
        axe: Type.AXE,
        mace: Type.MACE,
        dagger: Type.DAGGER,
        wand: Type.WAND,
        idol: Type.IDOL,
        libram: Type.LIBRAM,
        totem: Type.TOTEM,
        thrown: Type.THROWN,
        shield: Type.SHIELD,
        ["fist weapon"]: Type.FIST_WEAPON,
        staff: Type.STAFF,
        gun: Type.GUN,
        bow: Type.BOW,
        crossbow: Type.CROSSBOW,
        bullet: Type.BULLET,
        arrow: Type.ARROW,
    };
    protected default_value = Type.NONE;
}

export class SlotTypeParser extends MonoRegexHTMLTooltipBodyParser<SlotType> {
    protected readonly pattern = /<tr><td>(Head|Neck|Shoulder|Back|Chest|Shirt|Tabard|Wrist|Main Hand|Off Hand|One-hand|Held In Off-Hand|Two-hand|Ranged|Thrown|Projectile|Relic|Hands|Waist|Legs|Feet|Finger|Trinket)<\/td><th>(Plate|Mail|Leather|Cloth|Sword|Mace|Axe|Dagger|Wand|Shield|Fist Weapon|Staff|Gun|Bow|Crossbow|Thrown|Bullet|Arrow|Idol|Libram|Totem|)<\/th><\/tr>/;
    protected readonly default_value = { slot: Slot.NONE, type: Type.NONE };

    protected postformat(parse_result: string[]): SlotType {
        return {
            slot: new SlotLookupTable().perform_lookup(parse_result[1]),
            type: new TypeLookupTable().perform_lookup(parse_result[2]),
        };
    }
}
