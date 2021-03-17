export interface ISpell {
    id: number;
    name: string;
    description: string;
    url: string;
    thumbnail_url: string;
    trigger: string;
    is_simple: boolean;
    cast_time: number;
    range: number;
}

abstract class Spell implements ISpell {
    protected abstract readonly SIMPLE_SPELL_THUMBNAIL_URL: string;
    public readonly id: number;
    public readonly name: string;
    public readonly description: string;
    public readonly url: string;
    public readonly thumbnail_url: string;
    public readonly trigger: string;
    public readonly cast_time: number;
    public readonly range: number;

    public constructor(
        id: number,
        name: string,
        description: string,
        url: string,
        thumbnail_url: string,
        trigger: string,
        cast_time: number,
        range: number,
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.url = url;
        this.thumbnail_url = thumbnail_url;
        this.trigger = trigger;
        this.cast_time = cast_time;
        this.range = range;
    }

    public get is_simple(): boolean {
        return this.thumbnail_url === this.SIMPLE_SPELL_THUMBNAIL_URL;
    }
}

export class ClassicDBSpell extends Spell {
    protected readonly SIMPLE_SPELL_THUMBNAIL_URL = "https://classicdb.ch/images/icons/large/trade_engineering.jpg";
}

export class TBCDBSpell extends Spell {
    protected readonly SIMPLE_SPELL_THUMBNAIL_URL = "https://tbcdb.com/images/icons/large/temp.jpg";
}
