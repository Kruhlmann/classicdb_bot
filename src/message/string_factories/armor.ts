import { ItemPropertyStringFactory } from ".";

export class ArmorStringFactory extends ItemPropertyStringFactory<{ armor: number }> {
    public build(): string {
        if (this.item.armor === -1) {
            return "";
        }
        return `${this.item.armor} Armor`;
    }
}
