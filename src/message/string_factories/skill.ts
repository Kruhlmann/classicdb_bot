import { ItemPropertyStringFactory } from ".";
import { Skill, SkillLookupTable, SkillRequirement } from "../../parsers/skill";
import { capitalize_string } from "../../string";

export class SkillRequirementStringFactory extends ItemPropertyStringFactory<{ skill_requirement: SkillRequirement }> {
    public build(): string {
        if (this.item.skill_requirement.skill === Skill.NONE) {
            return "";
        }
        const skill_str = new SkillLookupTable().perform_reverse_lookup(this.item.skill_requirement.skill);
        return `Requires ${capitalize_string(skill_str)} (${this.item.skill_requirement.value})`;
    }
}
