import { AttributeLookupTable, AttributeStat } from "../../parsers/attributes";
import { capitalize_string } from "../../string";
import { GameObjectPropertyStringFactory } from ".";

export class AttributeStringFactory extends GameObjectPropertyStringFactory<{ attributes: AttributeStat[] }> {
    public build(): string {
        const result = [];
        for (const attribute of this.game_object.attributes) {
            result.push(this.make_attribute_str(attribute));
        }
        return result.join("\n");
    }

    private make_attribute_str(attribute: AttributeStat): string {
        const sign = attribute.value < 0 ? "-" : "+";
        const attribute_name = new AttributeLookupTable().perform_reverse_lookup(attribute.type);
        return `${sign}${Math.abs(attribute.value)} ${capitalize_string(attribute_name)}`;
    }
}
