import { LookupTable } from "../lookup_table";
import { MonoRegexHTMLTooltipBodyParser } from ".";

export interface ReputationRequirement {
    name: string;
    state: ReputationState;
}

export enum ReputationState {
    NONE,
    PARAGON,
    EXALTED,
    REVERED,
    HONORED,
    FRIENDLY,
    NEUTRAL,
    UNFRIENDLY,
    HOSTILE,
    HATED,
}

export class ReputationStateLookupTable extends LookupTable<ReputationState> {
    protected readonly lookup_table = {
        [""]: ReputationState.NONE,
        paragon: ReputationState.PARAGON,
        exalted: ReputationState.EXALTED,
        revered: ReputationState.REVERED,
        honored: ReputationState.HONORED,
        friendly: ReputationState.FRIENDLY,
        neutral: ReputationState.NEUTRAL,
        unfriendly: ReputationState.UNFRIENDLY,
        hostile: ReputationState.HOSTILE,
        hated: ReputationState.HATED,
    };
    protected readonly default_value = ReputationState.NONE;
}

export class ReputationRequirementParser extends MonoRegexHTMLTooltipBodyParser<ReputationRequirement> {
    protected readonly pattern = /Requires(?: <a href=".*?">)?([\d A-Za-z]+)(?:<\/a>)? - (Paragon|Exalted|Revered|Honored|Friendly|Neutral|Unfriendly|Hostile|Hated)/;
    protected readonly default_value = { name: "", state: ReputationState.NONE };

    protected postformat(parse_result: string[]): ReputationRequirement {
        const name = parse_result[1].trim();
        const state = new ReputationStateLookupTable().perform_lookup(parse_result[2]);
        return { name, state };
    }
}
