import { ItemStringFactory } from ".";
import { ReputationState, ReputationStateLookupTable } from "../../parsers/reputation";
import { capitalize_string } from "../../string";

export class ReputationRequirementStringFactory extends ItemStringFactory {
    public build(): string {
        if (this.item.reputation_requirement.state === ReputationState.NONE) {
            return "";
        }
        const reputation_str = new ReputationStateLookupTable().perform_reverse_lookup(
            this.item.reputation_requirement.state
        );
        return `Requires **${capitalize_string(reputation_str)}** with **${this.item.reputation_requirement.name}**`;
    }
}
