export const ASCII_START_LOWERCASE = 96;
export const ASCII_END_LOWERCASE = 123;
export const ASCII_START_UPPERCASE = 64;
export const ASCII_END_UPPERCASE = 91;
export const ASCII_START_DIGIT = 47;
export const ASCII_END_DIGIT = 58;

/**
 * Functions like CSS ellipsis text overflow but places the ellipsis in the
 * middle of the string if its length exceeds the specified limit.
 *
 * @param lim - String length limit.
 * @param target-  String to apply ellipsis to.
 * @param ellipsis - Ellipsis to place. Defaults to '...'.
 * @returns Sliced string delimited by ellipsis.
 */
export function ellipsis_middle(
    lim: number,
    target: string,
    ellipsis = "..."
): string {
    if (!target) {
        return target;
    }
    if (target.length <= lim) {
        return target;
    }

    const chunk_limit = Math.floor(lim / 2) - ellipsis.length;
    return target.slice(0, chunk_limit) + ellipsis + target.slice(-chunk_limit);
}

export function is_alphanumeric_ascii(target: string): boolean {
    for (let i = 0; i < target.length; i++) {
        const char_code = target.charCodeAt(i);
        const is_numeric = char_code_is_numeric_ascii(char_code);
        const is_letter = char_code_is_ascii_letter(char_code);

        if (!is_numeric && !is_letter) {
            return false;
        }
    }
    return true;
}

export function is_numeric_ascii(target: string): boolean {
    for (let i = 0; i < target.length; i++) {
        const char_code = target.charCodeAt(i);
        const is_numeric = char_code_is_numeric_ascii(char_code);

        if (!is_numeric) {
            return false;
        }
    }
    return true;
}

export function char_code_is_numeric_ascii(char_code: number): boolean {
    return char_code > ASCII_START_DIGIT && char_code < ASCII_END_DIGIT;
}

export function char_code_is_uppercase_ascii(char_code: number): boolean {
    return char_code > ASCII_START_UPPERCASE && char_code < ASCII_END_UPPERCASE;
}

export function char_code_is_lowercase_ascii(char_code: number): boolean {
    return char_code > ASCII_START_LOWERCASE && char_code < ASCII_END_LOWERCASE;
}

export function char_code_is_ascii_letter(char_code: number): boolean {
    const is_lowercase = char_code_is_lowercase_ascii(char_code);
    const is_uppercase = char_code_is_uppercase_ascii(char_code);
    return is_lowercase || is_uppercase;
}

export function has_lowercase_character(target: string): boolean {
    return target.toUpperCase() !== target;
}

export function has_uppercase_character(target: string): boolean {
    return target.toLowerCase() !== target;
}
