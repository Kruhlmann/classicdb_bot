import { GameObjectPropertyStringFactory } from ".";

export class UniqueStringFactory extends GameObjectPropertyStringFactory<{ uniquely_equipped: boolean }> {
    public build(): string {
        if (this.game_object.uniquely_equipped) {
            return "Unique";
        }
        return "";
    }
}
