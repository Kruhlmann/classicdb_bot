import { ReputationRequirement, ReputationState, ReputationStateLookupTable } from "../../parsers/reputation";
import { capitalize_string } from "../../string";
import { ItemPropertyStringFactory } from ".";

export class ReputationRequirementStringFactory extends ItemPropertyStringFactory<{
    reputation_requirement: ReputationRequirement;
}> {
    public build(): string {
        if (this.item.reputation_requirement.state === ReputationState.NONE) {
            return "";
        }
        const reputation_string = new ReputationStateLookupTable().perform_reverse_lookup(
            this.item.reputation_requirement.state,
        );
        return `Requires **${capitalize_string(reputation_string)}** with **${this.item.reputation_requirement.name}**`;
    }
}
