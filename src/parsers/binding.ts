import { HTMLTooltipBodyParser } from ".";

export enum ItemBinding {
    ON_PICKUP,
    ON_EQUIP,
    NONE,
}

export class BindingParser extends HTMLTooltipBodyParser<ItemBinding> {
    public static readonly bind_on_pickup = "Binds when picked up";
    public static readonly bind_on_equip = "Binds when equipped";

    public parse(): ItemBinding {
        if (this.tooltip_table_html.includes(BindingParser.bind_on_pickup)) {
            return ItemBinding.ON_PICKUP;
        }
        if (this.tooltip_table_html.includes(BindingParser.bind_on_equip)) {
            return ItemBinding.ON_EQUIP;
        }
        return ItemBinding.NONE;
    }
}
