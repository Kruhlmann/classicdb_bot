import { ItemBinding } from "../../parsers/binding";
import { ItemStringFactory } from ".";

export class ItemBindingStringFactory extends ItemStringFactory {
    public build(): string {
        if (this.item.binding === ItemBinding.NONE) {
            return "";
        }
        if (this.item.binding === ItemBinding.ON_EQUIP) {
            return "Binds when equipped";
        }
        if (this.item.binding === ItemBinding.ON_PICKUP) {
            return "Binds when picked up";
        }
    }
}
