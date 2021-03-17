import { GameObjectPropertyStringFactory } from ".";

export class ArmorStringFactory extends GameObjectPropertyStringFactory<{ armor: number }> {
    public build(): string {
        if (this.game_object.armor === -1) {
            return "";
        }
        return `${this.game_object.armor} Armor`;
    }
}
