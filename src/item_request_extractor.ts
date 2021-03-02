import { Expansion } from "./expansions";
import { ItemIdentity } from "./typings/types";

export class ItemRequestExtractor {
    public static readonly PATTERN_ITEM_IDENTIFIER_IMPLICIT_EXPANSION = /\[([a-zA-Z0-9 '"]*?)\](?!\(.*?\))/;
    public static readonly PATTERN_ITEM_IDENTIFIER_EXPLICIT_EXPANSION = /\[([a-zA-Z0-9 '"]*?)\](\(.*?\))/;

    public static get_item_identifiers_from_string(
        content: string,
        implicit_expansion: Expansion
    ): ItemIdentity[] {
        const implicit_items = ItemRequestExtractor.get_implicit_expansion_item_identifiers_from_string(
            content
        );

        return implicit_items;
    }

    private static get_implicit_expansion_item_identifiers_from_string(
        content: string
    ): ItemIdentity[] {
        const item_identities: ItemIdentity[] = [];

        let regex_search_result = ItemRequestExtractor.PATTERN_ITEM_IDENTIFIER_IMPLICIT_EXPANSION.exec(
            content
        );
        while (regex_search_result) {
            regex_search_result = ItemRequestExtractor.PATTERN_ITEM_IDENTIFIER_IMPLICIT_EXPANSION.exec(
                content
            );
        }

        return item_identities;
    }
}
