import * as cheerio from "cheerio";

import { HTMLTooltipBodyParser } from ".";
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

export class AttributeParser extends HTMLTooltipBodyParser<AttributeStat[]> {
    public static readonly attribute_pattern = /([+|-][0-9]+) (Agility|Strength|Intellect|Spirit|Stamina|(?:Fire|Frost|Arcane|Nature|Shadow) Resistance)/g;

    public async parse(): Promise<AttributeStat[]> {
        const attributes: AttributeStat[] = [];

        let attribute_match;
        do {
            attribute_match = AttributeParser.attribute_pattern.exec(this.tooltip_table_html);
            const attribute = this.extract_attribute_from_regex_match(attribute_match);
            if (attribute) {
                attributes.push(attribute);
            }
        } while (attribute_match);

        return attributes;
    }

    private extract_attribute_from_regex_match(match: string[]): AttributeStat | undefined {
        if (!match) {
            return;
        }
        const attribute_value = parseInt(match[1]);
        const attribute_type = match[2];

        return {
            value: attribute_value,
            type: new AttributeLookupTable().perform_lookup(attribute_type),
        };
    }
}
