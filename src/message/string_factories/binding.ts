import { ItemBinding } from "../../parsers/binding";
import { GameObjectPropertyStringFactory } from ".";

export class ItemBindingStringFactory extends GameObjectPropertyStringFactory<{ binding: ItemBinding }> {
    public build(): string {
        if (this.game_object.binding === ItemBinding.NONE) {
            return "";
        }
        if (this.game_object.binding === ItemBinding.ON_EQUIP) {
            return "Binds when equipped";
        }
        if (this.game_object.binding === ItemBinding.ON_PICKUP) {
            return "Binds when picked up";
        }
    }
}
