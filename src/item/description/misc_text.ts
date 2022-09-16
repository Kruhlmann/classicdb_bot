import { ItemTooltip } from "../tooltip";
import { DescriptionFieldParser } from "./field_parser";

export class MiscTextDescriptionFieldParser implements DescriptionFieldParser {
    public qualifies(field: ItemTooltip): boolean {
        return field.format === "Misc";
    }

    public mutate_label(field: ItemTooltip): string {
        return `*${field.label}*`;
    }
}
