/**
 * @fileoverview Class definition for Effect.
 * @author Andreask Kruhlmann
 * @since 1.2.0
 */

export class Effect {
    public static from_table(table: CheerioElement): Effect[] {
        console.log(!!table);
        return [new Effect()];
    }

    public static from_id(id: string | number) {
        console.log(id);
        return new Effect();
    }

    public id: string;
    public short_text: string;
    public href: string;
    public description: string;
    public name: string;
    public thumbnail_href: string;
    public trigger_name: string;
    public is_misc: boolean;

    public as_short_tooltip(): string {
        return "some_spell";
    }

    public to_messages() {

    }
}
