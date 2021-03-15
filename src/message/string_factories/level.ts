import { ItemPropertyStringFactory } from ".";

export class LevelRequirementStringFactory extends ItemPropertyStringFactory<{ level_requirement: number }> {
    public build(): string {
        if (this.item.level_requirement === -1) {
            return "";
        }
        return `Requires Level ${this.item.level_requirement}`;
    }
}
