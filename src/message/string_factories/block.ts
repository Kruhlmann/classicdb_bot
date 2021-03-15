import { ItemPropertyStringFactory } from ".";

export class BlockValueStringFactory extends ItemPropertyStringFactory<{ block_value: number }> {
    public build(): string {
        if (this.item.block_value === -1) {
            return "";
        }
        return `${this.item.block_value} Block`;
    }
}
