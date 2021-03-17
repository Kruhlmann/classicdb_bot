import { HTMLTooltipBodyParser, MonoRegexHTMLTooltipBodyParser } from ".";

export class IsPartOfQuestParser extends HTMLTooltipBodyParser<boolean> {
    public parse(): boolean {
        return this.tooltip_table_html.includes("Quest Item");
    }
}

abstract class BeginsQuestParser extends MonoRegexHTMLTooltipBodyParser<string> {
    protected readonly pattern = /<a.*?href="\?quest=(\d+)">This Item Begins a Quest<\/a>/;
    protected readonly default_value = "";
}

export class ClassicDBBeginsQuestParser extends BeginsQuestParser {
    protected postformat(parse_result: string[]): string {
        return `https://classic.wowhead.com/quest=${parse_result[1]}`;
    }
}

export class TBCDBBeginsQuestParser extends BeginsQuestParser {
    protected postformat(parse_result: string[]): string {
        return `https://tbc.wowhead.com/quest=${parse_result[1]}`;
    }
}
