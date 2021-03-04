import { HTMLTooltipBodyParser } from ".";

export class UniqueParser extends HTMLTooltipBodyParser<boolean> {
    public async parse(): Promise<boolean> {
        return this.tooltip_table_html.includes("Unique");
    }
}
