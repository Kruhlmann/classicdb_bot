import { ItemTooltip } from "../tooltip";
import { DescriptionFieldParser } from "./field_parser";

export class UncommonTextDescriptionFieldParser implements DescriptionFieldParser {
    public qualifies(field: ItemTooltip): boolean {
        return field.format === "Uncommon";
    }

    public mutate_label(field: ItemTooltip): string {
        return `**${field.label}**`;
    }
}
