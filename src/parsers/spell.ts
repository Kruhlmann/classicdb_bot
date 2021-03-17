import * as request from "request-promise";

import { MultiRegexHTMLEffectTooltipBodyParser } from ".";

export interface IPreResolvedSpellData {
    id: number;
    trigger: string;
    description: string;
}

export interface ISpellResolver {
    resolve_pre_resolved_spells(pre_resolved_spells: IPreResolvedSpellData[]): Promise<string[]>;
    resolve_pre_resolved_spell(pre_resolved_spell: IPreResolvedSpellData): Promise<string>;
}

abstract class PreResolvedSpellParser extends MultiRegexHTMLEffectTooltipBodyParser<IPreResolvedSpellData> {
    protected readonly default_value = { id: -1, trigger: "", description: "" };
}

export class ClassicDBPreResolvedSpellParser extends PreResolvedSpellParser {
    protected readonly pattern = /<span(?: .*?=".*?")?>(.*?): <a href="\?spell=(\d+)"(?: .*?=".*?")?>(.*?)<\/a><\/span>/g;

    protected postformat(parse_result: string[]): IPreResolvedSpellData {
        const trigger = parse_result[1];
        const id = Number.parseInt(parse_result[2]);
        const description = parse_result[3];

        return { id, trigger, description };
    }
}

export class TBCDBPreResolvedSpellParser extends PreResolvedSpellParser {
    protected readonly pattern = /<span(?: .*?=".*?")?>(.*?): (?:(?:<a href="\?spell=(\d+)"(?: .*?=".*?")?>(.*?)<\/a>)|(.*?))<\/span>/g;

    protected postformat(parse_result: string[]): IPreResolvedSpellData {
        if (parse_result[2] === undefined) {
            return this.postformat_simple_spell(parse_result);
        }
        return this.postformat_complex_spell(parse_result);
    }

    private postformat_simple_spell(parse_result: string[]): IPreResolvedSpellData {
        const trigger = parse_result[1];
        const description = parse_result[4];

        return { id: -1, trigger, description };
    }

    private postformat_complex_spell(parse_result: string[]): IPreResolvedSpellData {
        const trigger = parse_result[1];
        const id = Number.parseInt(parse_result[2]);
        const description = parse_result[3];

        return { id, trigger, description };
    }
}

abstract class SpellResolver implements ISpellResolver {
    protected abstract readonly base_url: string;

    public async resolve_pre_resolved_spells(pre_resolved_spells: IPreResolvedSpellData[]): Promise<string[]> {
        const promises = pre_resolved_spells.map((pre_resolved_spell) => {
            return this.resolve_pre_resolved_spell(pre_resolved_spell);
        });
        return Promise.all(promises);
    }

    public async resolve_pre_resolved_spell(pre_resolved_spell: IPreResolvedSpellData): Promise<string> {
        const url = `${this.base_url}/?spell=${pre_resolved_spell.id}`;
        const page_source: string = await request.get(url);
        return page_source;
    }
}

export class ClassicDBSpellResolver extends SpellResolver {
    protected readonly base_url = "https://classicdb.ch";
}

export class TBCDBSpellResolver extends SpellResolver {
    protected readonly base_url = "https://tbcdb.com";
}
