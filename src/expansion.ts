import { LookupTable } from "./lookup_table";

export enum Expansion {
    NONE,
    CLASSIC,
    TBC,
}

export class ExpansionLookupTable extends LookupTable<Expansion> {
    protected readonly default_value = Expansion.NONE;
    protected readonly lookup_table = {
        classic: Expansion.CLASSIC,
        tbc: Expansion.TBC,
    };
}
