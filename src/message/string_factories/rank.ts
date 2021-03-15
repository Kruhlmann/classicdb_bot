import { ItemStringFactory } from ".";
import { capitalize_string } from "../../string";
import { PVPRank, PVPRankLookupTable } from "../../parsers/rank";

export class PVPRankRequirementStringFactory extends ItemStringFactory {
    public build(): string {
        if (this.item.rank_requirement === PVPRank.NONE) {
            return "";
        }
        const rank_str = new PVPRankLookupTable().perform_reverse_lookup(this.item.rank_requirement);
        return `Requires ${capitalize_string(rank_str)}`;
    }
}
