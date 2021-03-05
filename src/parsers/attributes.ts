import * as cheerio from "cheerio";

import { HTMLTooltipBodyParser, MultiRegexHTMLTooltipBodyParser } from ".";
import { LookupTable } from "./lookup_table";

export enum Attribute {
    NONE,
    AGILITY,
    STRENGTH,
    INTELLECT,
    SPIRIT,
    STAMINA,
    FIRE_RESISTANCE,
    FROST_RESISTANCE,
    ARCANE_RESISTANCE,
    NATURE_RESISTANCE,
    SHADOW_RESISTANCE,
}

export type AttributeStat = {
    type: Attribute;
    value: number;
};

export class AttributeLookupTable extends LookupTable<Attribute> {
    protected lookup_table: Record<string, Attribute> = {
        agility: Attribute.AGILITY,
        strength: Attribute.STRENGTH,
        intellect: Attribute.INTELLECT,
        spirit: Attribute.SPIRIT,
        stamina: Attribute.STAMINA,
        ["fire resistance"]: Attribute.FIRE_RESISTANCE,
        ["frost resistance"]: Attribute.FROST_RESISTANCE,
        ["arcane resistance"]: Attribute.ARCANE_RESISTANCE,
        ["nature resistance"]: Attribute.NATURE_RESISTANCE,
        ["shadow resistance"]: Attribute.SHADOW_RESISTANCE,
    };
    protected default_value = Attribute.NONE;
}

export class AttributeParser extends MultiRegexHTMLTooltipBodyParser<AttributeStat> {
    protected readonly pattern = /([+|-][0-9]+) (Agility|Strength|Intellect|Spirit|Stamina|(?:Fire|Frost|Arcane|Nature|Shadow) Resistance)/g;

    protected postformat(parse_result: string[]): AttributeStat | undefined {
        const attribute_value = parseInt(parse_result[1]);
        const attribute_type = parse_result[2];

        return {
            value: attribute_value,
            type: new AttributeLookupTable().perform_lookup(attribute_type),
        };
    }
}
