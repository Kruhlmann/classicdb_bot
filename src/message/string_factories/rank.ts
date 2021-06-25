import { PVPRank, PVPRankLookupTable } from "../../parsers/rank";
import { capitalize_string } from "../../string";
import { GameObjectPropertyStringFactory } from ".";

export class PVPRankRequirementStringFactory extends GameObjectPropertyStringFactory<{ rank_requirement: PVPRank }> {
    public build(): string {
        if (this.game_object.rank_requirement === PVPRank.NONE) {
            return "";
        }
        const rank_string = new PVPRankLookupTable().perform_reverse_lookup(this.game_object.rank_requirement);
        return `Requires ${capitalize_string(rank_string)}`;
    }
}
