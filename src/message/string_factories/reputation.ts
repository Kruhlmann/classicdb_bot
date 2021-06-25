import { ReputationRequirement, ReputationState, ReputationStateLookupTable } from "../../parsers/reputation";
import { capitalize_string } from "../../string";
import { GameObjectPropertyStringFactory } from ".";

export class ReputationRequirementStringFactory extends GameObjectPropertyStringFactory<{
    reputation_requirement: ReputationRequirement;
}> {
    public build(): string {
        if (this.game_object.reputation_requirement.state === ReputationState.NONE) {
            return "";
        }
        const reputation_string = new ReputationStateLookupTable().perform_reverse_lookup(
            this.game_object.reputation_requirement.state,
        );
        return `Requires **${capitalize_string(reputation_string)}** with **${
            this.game_object.reputation_requirement.name
        }**`;
    }
}
