import { IParseable, MultiRegexHTMLEffectTooltipBodyParser } from "../parsers";
import { CastTimeParser } from "../parsers/cast_time";
import { FlavorTextParser } from "../parsers/flavor_text";
import { ClassicDBNameParser, TBCDBNameParser } from "../parsers/name";
import { RangeParser } from "../parsers/range";
import {
    ClassicDBPreResolvedSpellParser,
    ClassicDBSpellResolver,
    IPreResolvedSpellData,
    ISpellResolver,
    SpellPageContext,
    TBCDBPreResolvedSpellParser,
    TBCDBSpellResolver,
} from "../parsers/spell";
import { ClassicDBThumbnailParser, TBCDBThumbnailParser } from "../parsers/thumbnail";
import { ClassicDBSpell, ISpell, TBCDBSpell } from ".";

export interface ISpellFactory {
    from_item_page_source(item_page_source: string): Promise<ISpell[]>;
    from_spell_page_source(page_source: SpellPageContext): ISpell;
}

abstract class SpellFactory implements ISpellFactory {
    protected abstract create_pre_resolved_spell_parser(
        page_source: string,
    ): MultiRegexHTMLEffectTooltipBodyParser<IPreResolvedSpellData>;
    protected abstract create_spell_resolver(): ISpellResolver;
    protected abstract create_name_parser(page_source: string): IParseable<string>;
    protected abstract create_thumbnail_parser(page_source: string): IParseable<string>;

    protected abstract construct_spell(
        id: number,
        name: string,
        flavor_text: string,
        url: string,
        thumbnail_url: string,
        trigger: string,
        cast_time: number,
        range: number,
    ): ISpell;

    public async from_item_page_source(item_page_source: string): Promise<ISpell[]> {
        const pre_resolved_parser = this.create_pre_resolved_spell_parser(item_page_source);
        const resolver = this.create_spell_resolver();
        const pre_resolved_spells = pre_resolved_parser.parse();
        const page_sources = await resolver.resolve_pre_resolved_spells(pre_resolved_spells);
        const spells = page_sources.map((page_source) => {
            return this.from_spell_page_source(page_source);
        });
        return spells;
    }

    public from_spell_page_source(page_source: SpellPageContext): ISpell {
        const name = this.create_name_parser(page_source.source).parse();
        const range = new RangeParser(page_source.source).parse();
        const flavor_text = new FlavorTextParser(page_source.source).parse();
        const cast_time = new CastTimeParser(page_source.source).parse();
        const thumbnail = this.create_thumbnail_parser(page_source.source).parse();

        return this.construct_spell(
            page_source.id,
            name,
            flavor_text,
            page_source.url,
            thumbnail,
            page_source.trigger,
            cast_time,
            range,
        );
    }
}

export class ClassicDBSpellFactory extends SpellFactory {
    protected create_pre_resolved_spell_parser(
        page_source: string,
    ): MultiRegexHTMLEffectTooltipBodyParser<IPreResolvedSpellData> {
        return new ClassicDBPreResolvedSpellParser(page_source);
    }

    protected create_thumbnail_parser(page_source: string): IParseable<string> {
        return new ClassicDBThumbnailParser(page_source);
    }

    protected create_name_parser(page_source: string): IParseable<string> {
        return new ClassicDBNameParser(page_source);
    }

    protected create_spell_resolver(): ISpellResolver {
        return new ClassicDBSpellResolver();
    }

    protected construct_spell(
        id: number,
        name: string,
        flavor_text: string,
        url: string,
        thumbnail_url: string,
        trigger: string,
        cast_time: number,
        range: number,
    ): ISpell {
        return new ClassicDBSpell(id, name, flavor_text, url, thumbnail_url, trigger, cast_time, range);
    }
}

export class TBCDBSpellFactory extends SpellFactory {
    protected create_pre_resolved_spell_parser(
        page_source: string,
    ): MultiRegexHTMLEffectTooltipBodyParser<IPreResolvedSpellData> {
        return new TBCDBPreResolvedSpellParser(page_source);
    }

    protected create_thumbnail_parser(page_source: string): IParseable<string> {
        return new TBCDBThumbnailParser(page_source);
    }

    protected create_name_parser(page_source: string): IParseable<string> {
        return new TBCDBNameParser(page_source);
    }

    protected create_spell_resolver(): ISpellResolver {
        return new TBCDBSpellResolver();
    }

    protected construct_spell(
        id: number,
        name: string,
        flavor_text: string,
        url: string,
        thumbnail_url: string,
        trigger: string,
        cast_time: number,
        range: number,
    ): ISpell {
        return new TBCDBSpell(id, name, flavor_text, url, thumbnail_url, trigger, cast_time, range);
    }
}
