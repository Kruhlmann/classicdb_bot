import { ItemStringFactory } from ".";
import { Skill, SkillLookupTable } from "../../parsers/skill";
import { capitalize_string } from "../../string";

export class SkillRequirementStringFactory extends ItemStringFactory {
    public build(): string {
        if (this.item.skill_requirement.skill === Skill.NONE) {
            return "";
        }
        const skill_str = new SkillLookupTable().perform_reverse_lookup(this.item.skill_requirement.skill);
        return `Requires ${capitalize_string(skill_str)} (${this.item.skill_requirement.value})`;
    }
}
