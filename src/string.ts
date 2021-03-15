export function capitalize_string<SerializeableType>(target: SerializeableType): string {
    const target_str = `${target}`;
    if (target_str === "") {
        return "";
    }
    return target_str[0].toUpperCase() + target_str.substr(1);
}
