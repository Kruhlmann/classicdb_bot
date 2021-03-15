import { ItemStringFactory } from ".";

export class UniqueStringFactory extends ItemStringFactory {
    public build(): string {
        if (this.item.uniquely_equipped) {
            return "Unique";
        }
        return "";
    }
}
