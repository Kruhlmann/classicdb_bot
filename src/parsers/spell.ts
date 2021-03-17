import { MultiRegexHTMLEffectTooltipBodyParser } from ".";

export interface PreResolvedSpellData {
    id: number;
    trigger: string;
    description: string;
}

abstract class SpellParser extends MultiRegexHTMLEffectTooltipBodyParser<PreResolvedSpellData> {
    protected readonly default_value = { id: -1, trigger: "", description: "" };
}

export class ClassicDBSpellParser extends SpellParser {
    protected readonly pattern = /<span(?: .*?=".*?")?>(.*?): <a href="\?spell=(\d+)"(?: .*?=".*?")?>(.*?)<\/a><\/span>/g;

    protected postformat(parse_result: string[]): PreResolvedSpellData {
        const trigger = parse_result[1];
        const id = Number.parseInt(parse_result[2]);
        const description = parse_result[3];

        return { id, trigger, description };
    }
}

export class TBCDBSpellParser extends SpellParser {
    protected readonly pattern = /<span(?: .*?=".*?")?>(.*?): (?:(?:<a href="\?spell=(\d+)"(?: .*?=".*?")?>(.*?)<\/a>)|(.*?))<\/span>/g;

    protected postformat(parse_result: string[]): PreResolvedSpellData {
        if (parse_result[2] === undefined) {
            return this.postformat_simple_spell(parse_result);
        }
        return this.postformat_complex_spell(parse_result);
    }

    private postformat_simple_spell(parse_result: string[]): PreResolvedSpellData {
        const trigger = parse_result[1];
        const description = parse_result[4];

        return { id: -1, trigger, description };
    }

    private postformat_complex_spell(parse_result: string[]): PreResolvedSpellData {
        const trigger = parse_result[1];
        const id = Number.parseInt(parse_result[2]);
        const description = parse_result[3];

        return { id, trigger, description };
    }
}
