import { ItemPropertyStringFactory } from ".";

export class DurabilityStringFactory extends ItemPropertyStringFactory<{ durability: number }> {
    public build(): string {
        if (this.item.durability === -1) {
            return "";
        }
        return `Durability: ${this.item.durability}/${this.item.durability}`;
    }
}
