import { LookupTable } from "../lookup_table";
import { MonoRegexHTMLTooltipBodyParser } from ".";

export enum PVPRank {
    NONE,
    PRIVATE,
    SCOUT,
    CORPORAL,
    GRUNT,
    SERGEANT,
    MASTER_SERGEANT,
    SENIOR_SERGEANT,
    SERGEANT_MAJOR,
    FIRST_SERGEANT,
    KNIGHT,
    STONE_GUARD,
    KNIGHT_LIEUTENANT,
    BLOOD_GUARD,
    KNIGHT_CAPTAIN,
    LEGIONNAIRE,
    KNIGHT_CHAMPION,
    CENTURION,
    LIEUTENANT_COMMANDER,
    CHAMPION,
    COMMANDER,
    LIEUTENANT_GENERAL,
    MARSHAL,
    GENERAL,
    FIELD_MARSHAL,
    WARLORD,
    GRAND_MARSHAL,
    HIGH_WARLORD,
}

export class PVPRankLookupTable extends LookupTable<PVPRank> {
    protected readonly lookup_table = {
        [""]: PVPRank.NONE,
        ["private"]: PVPRank.PRIVATE,
        ["scout"]: PVPRank.SCOUT,
        ["corporal"]: PVPRank.CORPORAL,
        ["grunt"]: PVPRank.GRUNT,
        ["sergeant"]: PVPRank.SERGEANT,
        ["master sergeant"]: PVPRank.MASTER_SERGEANT,
        ["senior sergeant"]: PVPRank.SENIOR_SERGEANT,
        ["sergeant major"]: PVPRank.SERGEANT_MAJOR,
        ["first sergeant"]: PVPRank.FIRST_SERGEANT,
        ["knight"]: PVPRank.KNIGHT,
        ["stone guard"]: PVPRank.STONE_GUARD,
        ["knight-lieutenant"]: PVPRank.KNIGHT_LIEUTENANT,
        ["blood guard"]: PVPRank.BLOOD_GUARD,
        ["knight-captain"]: PVPRank.KNIGHT_CAPTAIN,
        ["legionnaire"]: PVPRank.LEGIONNAIRE,
        ["knight-champion"]: PVPRank.KNIGHT_CHAMPION,
        ["centurion"]: PVPRank.CENTURION,
        ["lieutenant commander"]: PVPRank.LIEUTENANT_COMMANDER,
        ["champion"]: PVPRank.CHAMPION,
        ["commander"]: PVPRank.COMMANDER,
        ["lieutenant general"]: PVPRank.LIEUTENANT_GENERAL,
        ["marshal"]: PVPRank.MARSHAL,
        ["general"]: PVPRank.GENERAL,
        ["field marshal"]: PVPRank.FIELD_MARSHAL,
        ["warlord"]: PVPRank.WARLORD,
        ["grand marshal"]: PVPRank.GRAND_MARSHAL,
        ["high warlord"]: PVPRank.HIGH_WARLORD,
    };
    protected readonly default_value = PVPRank.NONE;
}

export class PVPRankRequirementParser extends MonoRegexHTMLTooltipBodyParser<PVPRank> {
    protected readonly pattern = /Requires (Private|Scout|Corporal|Grunt|Sergeant|Master Sergeant|Senior Sergeant|Sergeant Major|First Sergeant|Knight|Stone Guard|Knight-Lieutenant|Blood Guard|Knight-Captain|Legionnaire|Knight-Champion|Centurion|Lieutenant Commander|Champion|Commander|Lieutenant General|Marshal|General|Field Marshal|Warlord|Grand Marshal|High Warlord)/;
    protected readonly default_value = PVPRank.NONE;

    protected postformat(parse_result: string[]): PVPRank {
        return new PVPRankLookupTable().perform_lookup(parse_result[1]);
    }
}
