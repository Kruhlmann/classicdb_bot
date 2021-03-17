export function capitalize_string<SerializeableType>(target: SerializeableType): string {
    const target_string = `${target}`;
    if (target_string === "") {
        return "";
    }
    return target_string[0].toUpperCase() + target_string.slice(1);
}
