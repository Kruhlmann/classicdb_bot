import { ItemStringFactory } from ".";
import { Expansion } from "../../expansion";
import { ClassLookupTable } from "../../parsers/class";
import { capitalize_string } from "../../string";

export class ClassRestrictionStringFactory extends ItemStringFactory {
    public build(): string {
        const class_links = this.make_class_links();
        if (class_links.length === 0) {
            return "";
        }

        const class_links_str = class_links.join(" ");
        return `Classes: ${class_links_str}`;
    }

    private make_class_links(): string[] {
        const class_restriction_strings = this.get_item_class_restriction_string_repr();
        if (this.item.expansion === Expansion.CLASSIC) {
            return class_restriction_strings.map((cls_str) => {
                const capitalized = capitalize_string(cls_str);
                return `[${capitalized}](https://classic.wowhead.com/${cls_str})`;
            });
        }
        return class_restriction_strings.map((cls_str) => {
            const capitalized = capitalize_string(cls_str);
            return `[${capitalized}](https://tbc.wowhead.com/${cls_str})`;
        });
    }

    private get_item_class_restriction_string_repr(): string[] {
        const lookup_table = new ClassLookupTable();
        return this.item.class_restrictions.map((cls) => {
            return lookup_table.perform_reverse_lookup(cls);
        });
    }
}
