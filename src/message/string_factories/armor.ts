import { ItemStringFactory } from ".";

export class ArmorStringFactory extends ItemStringFactory {
    public build(): string {
        if (this.item.armor === -1) {
            return "";
        }
        return `${this.item.armor} Armor`;
    }
}
