import { ItemPropertyStringFactory } from ".";

export class UniqueStringFactory extends ItemPropertyStringFactory<{ uniquely_equipped: boolean }> {
    public build(): string {
        if (this.item.uniquely_equipped) {
            return "Unique";
        }
        return "";
    }
}
