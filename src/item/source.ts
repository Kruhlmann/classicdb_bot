import { Faction } from "./faction";
import { ItemQuest } from "./quest";
import { ItemSourceCategory } from "./source_category";

export declare interface ItemSource {
    category: ItemSourceCategory;
    name?: string;
    faction?: Faction;
    cost?: number;
    quests?: ItemQuest[];
    zone?: number;
    dropChance?: number;
}
