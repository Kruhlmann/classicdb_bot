import { MultiRegexHTMLEffectTooltipBodyParser } from ".";
import * as cheerio from "cheerio";

export type PreResolvedSpellData = { id: number; trigger: string; description: string };

export class SpellParser extends MultiRegexHTMLEffectTooltipBodyParser<PreResolvedSpellData> {
    protected readonly pattern = /<span(?: .*?=".*?")?>(.*?)<a href="\?spell=([0-9]+)"(?: .*?=".*?")?>(.*?)<\/a><\/span>/g;
    protected readonly default_value = "";

    protected postformat(parse_result: string[]): PreResolvedSpellData {
        const trigger = parse_result[1].replace(/:/g, "").trim();
        const id = parseInt(parse_result[2]);
        const description = parse_result[3];

        return { id, trigger, description };
    }
}
