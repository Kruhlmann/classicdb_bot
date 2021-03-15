export abstract class LookupTable<LookupValueType extends string | number | symbol> {
    protected abstract lookup_table: Record<string, LookupValueType>;
    protected abstract default_value: LookupValueType;

    public perform_lookup(key?: string): LookupValueType {
        if (key === undefined) {
            return this.default_value;
        }
        const lowercase_key = key.toLowerCase();
        const value = this.lookup_table[lowercase_key];

        if (!value) {
            return this.default_value;
        }
        return value;
    }

    public perform_reverse_lookup(key?: LookupValueType) {
        const reverse_lookup_table: Record<LookupValueType, string> = {} as Record<LookupValueType, string>;
        for (const [key, obj] of Object.entries(this.lookup_table)) {
            reverse_lookup_table[obj] = key;
        }
        const value = reverse_lookup_table[key];

        if (!value) {
            return reverse_lookup_table[this.default_value];
        }
        return value;
    }
}
