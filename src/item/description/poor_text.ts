import { ItemTooltip } from "../tooltip";
import { DescriptionFieldParser } from "./field_parser";

export class PoorTextDescriptionFieldParser implements DescriptionFieldParser {
    public qualifies(field: ItemTooltip): boolean {
        return field.format === "Poor";
    }

    public mutate_label(field: ItemTooltip): string {
        return `*${field.label}*`;
    }
}
