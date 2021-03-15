import { Item } from "../../item";

export abstract class ItemStringFactory {
    protected readonly item: Item;

    public constructor(item: Item) {
        this.item = item;
    }

    public abstract build(): string;
}
