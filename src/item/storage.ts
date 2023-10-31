import { readFileSync } from "node:fs";
import * as path from "node:path";

import { Item } from "./item";

let items: Item[] = [];
let autocomplete: Record<string, { name: string; value: string }>;

export function get_items(): Item[] {
    if (items.length === 0) {
        items = JSON.parse(readFileSync(path.join(__dirname, "../../data.json")).toString());
    }
    return items;
}

export function get_autocomplete(): Record<string, { name: string; value: string }> {
    if (autocomplete === undefined) {
        autocomplete = {};
        const items = get_items();
        for (const item of items) {
            autocomplete[`${item.name.toLowerCase()} ${item.itemId}`] = { name: item.name, value: item.name };
        }
    }
    return autocomplete;
}

export class ItemStorage {
    protected readonly path: string;
    protected cache: Item[];

    public constructor(path: string) {
        this.path = path;
    }

    public read(): Item[] {
        if (this.cache === undefined) {
            this.cache = JSON.parse(readFileSync(this.path).toString());
        }
        return this.cache;
    }
}
