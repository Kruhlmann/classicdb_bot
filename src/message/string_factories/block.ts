import { ItemStringFactory } from ".";

export class BlockValueStringFactory extends ItemStringFactory {
    public build(): string {
        if (this.item.block_value === -1) {
            return "";
        }
        return `${this.item.block_value} Block`;
    }
}
