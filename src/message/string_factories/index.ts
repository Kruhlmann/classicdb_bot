export abstract class ItemPropertyStringFactory<PropertyContainer> {
    protected readonly item: PropertyContainer;

    public constructor(item: PropertyContainer) {
        this.item = item;
    }

    public abstract build(): string;
}
