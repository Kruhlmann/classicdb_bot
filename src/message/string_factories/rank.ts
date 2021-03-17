import { PVPRank, PVPRankLookupTable } from "../../parsers/rank";
import { capitalize_string } from "../../string";
import { ItemPropertyStringFactory } from ".";

export class PVPRankRequirementStringFactory extends ItemPropertyStringFactory<{ rank_requirement: PVPRank }> {
    public build(): string {
        if (this.item.rank_requirement === PVPRank.NONE) {
            return "";
        }
        const rank_string = new PVPRankLookupTable().perform_reverse_lookup(this.item.rank_requirement);
        return `Requires ${capitalize_string(rank_string)}`;
    }
}
