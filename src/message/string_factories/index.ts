export abstract class GameObjectPropertyStringFactory<PropertyContainer> {
    protected readonly game_object: PropertyContainer;

    public constructor(game_object: PropertyContainer) {
        this.game_object = game_object;
    }

    public abstract build(): string;
}
