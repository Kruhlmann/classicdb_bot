

export class EffectExtendable {
    public static from_id: (id: string,
                            trigger: string) => Promise<EffectExtendable>;

    public id: string;
    public name: string;
    public href: string;
    public description: string;
    public thumbnail_href: string;
    public trigger_name: string;
    public is_misc: boolean;
    public cast_time: string;
    public range: string;
}
