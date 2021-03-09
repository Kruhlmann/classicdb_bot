export abstract class LookupTable<LookupValueType> {
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
}
