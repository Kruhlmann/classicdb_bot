import { GameObjectPropertyStringFactory } from ".";

export class FlavorTextStringFactory extends GameObjectPropertyStringFactory<{ flavor_text: string }> {
    public build(): string {
        if (this.game_object.flavor_text === "") {
            return "";
        }
        return `───\n*${this.game_object.flavor_text}*`;
    }
}
