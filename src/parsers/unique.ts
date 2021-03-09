import { HTMLTooltipBodyParser } from ".";

export class UniqueParser extends HTMLTooltipBodyParser<boolean> {
    public parse(): boolean {
        return this.tooltip_table_html.includes("Unique");
    }
}
