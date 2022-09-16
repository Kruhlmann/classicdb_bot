import { Item } from "../item";
import { ItemTooltip } from "../tooltip";
import { DescriptionFieldParser } from "./field_parser";

export class EpicTextDescriptionFieldParser implements DescriptionFieldParser {
    protected readonly items: Item[];

    public constructor(items: Item[]) {
        this.items = items;
    }

    public qualifies(field: ItemTooltip): boolean {
        return field.format === "Epic";
    }

    public mutate_label(field: ItemTooltip): string {
        const found_item = this.items.find((item) => item.name === field.label);
        if (found_item !== undefined) {
            return `**<:blank:1020314576446836746> [${field.label}](https://wowhead.com/wotlk/item=${found_item.itemId}/)**`;
        }
        return `**<:blank:1020314576446836746> ${field.label}**`;
    }
}
