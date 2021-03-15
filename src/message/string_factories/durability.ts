import { ItemStringFactory } from ".";

export class DurabilityStringFactory extends ItemStringFactory {
    public build(): string {
        if (this.item.durability === -1) {
            return "";
        }
        return `Durability: ${this.item.durability}/${this.item.durability}`;
    }
}
