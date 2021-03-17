type RecordKey = string | number;

export interface ILookupTable<LookupValueType extends RecordKey> {
    perform_lookup(key?: RecordKey): LookupValueType;
    perform_reverse_lookup(key?: LookupValueType): RecordKey;
}

export abstract class LookupTable<LookupValueType extends RecordKey> {
    protected abstract lookup_table: Record<string, LookupValueType>;
    protected abstract default_value: LookupValueType;

    public perform_lookup(key?: RecordKey): LookupValueType {
        if (key === undefined) {
            return this.default_value;
        }
        if (String(key) === key) {
            key = key.toLowerCase();
        }
        const value = this.lookup_table[key];

        if (!value) {
            return this.default_value;
        }
        return value;
    }

    public perform_reverse_lookup(key?: LookupValueType): RecordKey {
        // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
        const reverse_lookup_table: Record<LookupValueType, RecordKey> = {} as Record<LookupValueType, RecordKey>;
        for (const [key, object] of Object.entries(this.lookup_table)) {
            reverse_lookup_table[object] = key;
        }
        const value = reverse_lookup_table[key];

        if (!value) {
            return reverse_lookup_table[this.default_value];
        }
        return value;
    }
}
