type RecordKey = string | number;

class ReturnDefaultValueError extends Error {
    public name = "ReturnDefaultValueError";
}

export interface ILookupTable<LookupValueType extends RecordKey> {
    perform_lookup(key?: RecordKey): LookupValueType;
    perform_reverse_lookup(key?: LookupValueType): RecordKey;
}

export abstract class LookupTable<LookupValueType extends RecordKey> {
    protected abstract lookup_table: Record<string, LookupValueType>;
    protected abstract default_value: LookupValueType;

    private throw_default_value_error_if_undefined<ParameterType>(parameter?: ParameterType): void {
        if (parameter === undefined) {
            throw new ReturnDefaultValueError();
        }
    }

    private transform_key_to_lowercase_if_string(key: RecordKey): RecordKey {
        if (String(key) === key) {
            return key.toLowerCase();
        }
        return key;
    }

    private perform_lookup_or_throw_error(key?: RecordKey): LookupValueType {
        this.throw_default_value_error_if_undefined(key);
        key = this.transform_key_to_lowercase_if_string(key);
        const value = this.lookup_table[key];
        this.throw_default_value_error_if_undefined(value);
        return value;
    }

    public perform_lookup(key?: RecordKey): LookupValueType {
        try {
            return this.perform_lookup_or_throw_error(key);
        } catch {
            return this.default_value;
        }
    }

    private get reverse_lookup_table(): Map<LookupValueType, RecordKey> {
        const reverse_lookup_table: Map<LookupValueType, RecordKey> = new Map();
        for (const [key, object] of Object.entries(this.lookup_table)) {
            reverse_lookup_table.set(object, key);
        }
        return reverse_lookup_table;
    }

    public perform_reverse_lookup(key?: LookupValueType): RecordKey {
        const value = this.reverse_lookup_table.get(key);
        if (value !== undefined) {
            return value;
        }
        return this.reverse_lookup_table.get(this.default_value);
    }
}
