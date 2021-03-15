import { ItemBinding } from "../../parsers/binding";
import { ItemPropertyStringFactory } from ".";

export class ItemBindingStringFactory extends ItemPropertyStringFactory<{ binding: ItemBinding }> {
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
