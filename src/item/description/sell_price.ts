import { ItemTooltip } from "../tooltip";
import { DescriptionFieldParser } from "./field_parser";

export class SellPriceDescriptionFieldParser implements DescriptionFieldParser {
    public qualifies(field: ItemTooltip): boolean {
        return field.label === "Sell Price:";
    }

    public mutate_label(_field: ItemTooltip): string {
        return "";
    }
}
