import { HTMLTooltipBodyParser } from ".";

export class BeginsQuestParser extends HTMLTooltipBodyParser<boolean> {
    public async parse(): Promise<boolean> {
        return this.tooltip_table_html.includes("Quest Item");
    }
}
