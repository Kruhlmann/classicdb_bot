import { ItemClass } from "./class";
import { ItemQuality } from "./quality";
import { ItemSlot } from "./slot";
import { ItemSource } from "./source";
import { ItemSubClass } from "./sub_class";
import { ItemTooltip } from "./tooltip";

export interface Item {
    itemId: number;
    name: string;
    icon: string;
    class: ItemClass;
    subclass: ItemSubClass;
    sellPrice: number;
    quality: ItemQuality;
    itemLevel: number;
    requiredLevel: number;
    slot: ItemSlot;
    tooltip: ItemTooltip[];
    itemLink: string;
    vendorPrice: number;
    source: ItemSource;
    uniqueName: string;
}
