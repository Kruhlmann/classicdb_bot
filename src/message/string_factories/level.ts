import { GameObjectPropertyStringFactory } from ".";

export class LevelRequirementStringFactory extends GameObjectPropertyStringFactory<{ level_requirement: number }> {
    public build(): string {
        if (this.game_object.level_requirement === -1) {
            return "";
        }
        return `Requires Level ${this.game_object.level_requirement}`;
    }
}
