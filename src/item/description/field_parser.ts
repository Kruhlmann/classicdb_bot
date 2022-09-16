import { ItemTooltip } from "../tooltip";

export interface DescriptionFieldParser {
    qualifies(field: ItemTooltip): boolean;
    mutate_label(field: ItemTooltip): string;
}
