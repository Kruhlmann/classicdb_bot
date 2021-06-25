import { GameObjectPropertyStringFactory } from ".";

export class BlockValueStringFactory extends GameObjectPropertyStringFactory<{ block_value: number }> {
    public build(): string {
        if (this.game_object.block_value === -1) {
            return "";
        }
        return `${this.game_object.block_value} Block`;
    }
}
