import { Expansion } from "../../expansion";
import { Class, ClassLookupTable } from "../../parsers/class";
import { capitalize_string } from "../../string";
import { GameObjectPropertyStringFactory } from ".";

export class ClassRestrictionStringFactory extends GameObjectPropertyStringFactory<{
    expansion: Expansion;
    class_restrictions: Class[];
}> {
    public build(): string {
        const class_links = this.make_class_links();
        if (class_links.length === 0) {
            return "";
        }

        const class_links_string = class_links.join(" ");
        return `Classes: ${class_links_string}`;
    }

    private make_class_links(): string[] {
        const class_restriction_strings = this.get_item_class_restriction_string_repr();
        if (this.game_object.expansion === Expansion.CLASSIC) {
            return class_restriction_strings.map((cls_string) => {
                const capitalized = capitalize_string(cls_string);
                return `[${capitalized}](https://classic.wowhead.com/${cls_string})`;
            });
        }
        return class_restriction_strings.map((cls_string) => {
            const capitalized = capitalize_string(cls_string);
            return `[${capitalized}](https://tbc.wowhead.com/${cls_string})`;
        });
    }

    private get_item_class_restriction_string_repr(): string[] {
        const lookup_table = new ClassLookupTable();
        return this.game_object.class_restrictions.map((cls) => {
            return `${lookup_table.perform_reverse_lookup(cls)}`;
        });
    }
}
