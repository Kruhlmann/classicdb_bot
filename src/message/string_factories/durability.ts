import { GameObjectPropertyStringFactory } from ".";

export class DurabilityStringFactory extends GameObjectPropertyStringFactory<{ durability: number }> {
    public build(): string {
        if (this.game_object.durability === -1) {
            return "";
        }
        return `Durability: ${this.game_object.durability}/${this.game_object.durability}`;
    }
}
