import { LookupTable } from "../lookup_table";
import { MonoRegexHTMLTooltipBodyParser } from ".";

export interface SkillRequirement {
    skill: Skill;
    value: number;
}

export enum Skill {
    NONE,
    HERBALISM,
    MINING,
    SKINNING,
    ALCHEMY,
    BLACKSMITHING,
    ENCHANTING,
    ENGINEERING,
    JEWELCRAFTING,
    LEATHERWORKING,
    TAILORING,
    COOKING,
    FIRST_AID,
    FISHING,
    LOCKPICKING,
    POISONS,
    RIDING,
}

export class SkillLookupTable extends LookupTable<Skill> {
    protected readonly lookup_table = {
        [""]: Skill.NONE,
        herbalism: Skill.HERBALISM,
        mining: Skill.MINING,
        skinning: Skill.SKINNING,
        alchemy: Skill.ALCHEMY,
        blacksmithing: Skill.BLACKSMITHING,
        enchanting: Skill.ENCHANTING,
        engineering: Skill.ENGINEERING,
        jewelcrafting: Skill.JEWELCRAFTING,
        leatherworking: Skill.LEATHERWORKING,
        tailoring: Skill.TAILORING,
        cooking: Skill.COOKING,
        ["first aid"]: Skill.FIRST_AID,
        fishing: Skill.FISHING,
        lockpicking: Skill.LOCKPICKING,
        poisons: Skill.POISONS,
        riding: Skill.RIDING,
    };
    protected readonly default_value = Skill.NONE;
}

export class SkillRequirementParser extends MonoRegexHTMLTooltipBodyParser<SkillRequirement> {
    protected readonly pattern = /Requires ([ A-Za-z]+) \((\d+)\)/;
    protected readonly default_value = { skill: Skill.NONE, value: -1 };

    protected postformat(parse_result: string[]): SkillRequirement {
        const skill = new SkillLookupTable().perform_lookup(parse_result[1]);
        const value = Number.parseInt(parse_result[2]);
        return { skill, value };
    }
}
