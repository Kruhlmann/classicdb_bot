export function capitalize_string(target: string): string {
    if (target === "") {
        return "";
    }
    return target[0].toUpperCase() + target.substr(1);
}
