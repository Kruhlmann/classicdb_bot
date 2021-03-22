import { parse } from "ts-command-line-args";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ArgumentConfig<T extends { [name: string]: any }> = {
    [P in keyof T]-?: PropertyConfig<T[P]>;
};
type PropertyConfig<T> = undefined extends T ? PropertyOptions<T> : RequiredPropertyOptions<T>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RequiredPropertyOptions<T> = any[] extends T ? PropertyOptions<T> : TypeConstructor<T> | PropertyOptions<T>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TypeConstructor<T> = (value: any) => T extends (infer R)[] ? R | undefined : T | undefined;
type GenericPropertyOptions<T> = {
    type: TypeConstructor<T>;
    alias?: string;
    multiple?: boolean;
    lazyMultiple?: boolean;
    defaultOption?: boolean;
    defaultValue?: T;
    group?: string | string[];
    description?: string;
    typeLabel?: string;
};
type PropertyOptions<T> = OptionalPropertyOptions<T> & MultiplePropertyOptions<T> & GenericPropertyOptions<T>;
type OptionalPropertyOptions<T> = undefined extends T ? { optional: true } : unknown;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MultiplePropertyOptions<T> = any[] extends T ? { multiple: true } | { lazyMultiple: true } : unknown;

export interface IArgumentParser<ArgumentSpec> {
    argument_config: ArgumentConfig<ArgumentSpec>;
    parse(): ArgumentSpec;
}

abstract class ArgumentParser<ArgumentSpec> implements IArgumentParser<ArgumentSpec> {
    public abstract readonly argument_config: ArgumentConfig<ArgumentSpec>;

    public parse(): ArgumentSpec {
        return parse<ArgumentSpec>(this.argument_config);
    }
}

export class ClassicDBBotArgumentParser extends ArgumentParser<{ log_file: string }> {
    public readonly argument_config: ArgumentConfig<{ log_file: string }> = {
        log_file: { type: String, optional: true, alias: "f", defaultValue: "/dev/stdout" },
    };
}
