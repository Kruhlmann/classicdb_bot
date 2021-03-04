import { HTMLTooltipBodyParser } from ".";

export class UniqueParser extends HTMLTooltipBodyParser<boolean> {
    public static readonly bind_on_pickup = "Binds when picked up";
    public static readonly bind_on_equip = "Binds when equipped";

    public async parse(): Promise<boolean> {
        return this.tooltip_table_html.includes("Unique");
    }
}
