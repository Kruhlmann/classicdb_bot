import { Skill, SkillLookupTable, SkillRequirement } from "../../parsers/skill";
import { capitalize_string } from "../../string";
import { GameObjectPropertyStringFactory } from ".";

export class SkillRequirementStringFactory extends GameObjectPropertyStringFactory<{
    skill_requirement: SkillRequirement;
}> {
    public build(): string {
        if (this.game_object.skill_requirement.skill === Skill.NONE) {
            return "";
        }
        const skill_string = new SkillLookupTable().perform_reverse_lookup(this.game_object.skill_requirement.skill);
        return `Requires ${capitalize_string(skill_string)} (${this.game_object.skill_requirement.value})`;
    }
}
