import { GameObjectPropertyStringFactory } from ".";

export class RangeStringFactory extends GameObjectPropertyStringFactory<{ range: number }> {
    public build(): string {
        if (this.game_object.range === -1) {
            return "";
        } else if (this.game_object.range === 0) {
            return "**Melee Range**";
        }
        return `**${this.game_object.range} yd range**`;
    }
}
