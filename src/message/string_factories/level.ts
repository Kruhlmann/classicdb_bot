import { ItemStringFactory } from ".";

export class LevelRequirementStringFactory extends ItemStringFactory {
    public build(): string {
        if (this.item.level_requirement === -1) {
            return "";
        }
        return `Requires Level ${this.item.level_requirement}`;
    }
}
