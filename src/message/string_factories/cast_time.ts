import { GameObjectPropertyStringFactory } from ".";

export class CastTimeStringFactory extends GameObjectPropertyStringFactory<{ cast_time: number }> {
    public build(): string {
        if (this.game_object.cast_time === 0) {
            return "**Instant cast**";
        }
        return `**${this.game_object.cast_time} sec cast**`;
    }
}
