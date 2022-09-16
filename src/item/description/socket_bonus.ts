import { ItemTooltip } from "../tooltip";
import { DescriptionFieldParser } from "./field_parser";

export class SocketBonusDescriptionFieldParser implements DescriptionFieldParser {
    public qualifies(field: ItemTooltip): boolean {
        return field.label.startsWith("Socket Bonus");
    }

    public mutate_label(field: ItemTooltip): string {
        return `<:blank:1020314576446836746> ${field.label}`;
    }
}
