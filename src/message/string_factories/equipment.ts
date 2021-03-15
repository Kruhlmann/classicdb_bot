import { Slot, SlotLookupTable, Type, TypeLookupTable } from "../../parsers/slot_type";
import { capitalize_string } from "../../string";
import { ItemPropertyStringFactory } from ".";

export class EquipmentStringFactory extends ItemPropertyStringFactory<{ slot: Slot; type: Type }> {
    public build(): string {
        if (this.item.slot !== Slot.NONE && this.item.type !== Type.NONE) {
            const slot = new SlotLookupTable().perform_reverse_lookup(this.item.slot);
            const type = new TypeLookupTable().perform_reverse_lookup(this.item.type);
            return `**${capitalize_string(slot)} ${capitalize_string(type)}**`;
        }
        if (this.item.slot !== Slot.NONE) {
            const slot = new SlotLookupTable().perform_reverse_lookup(this.item.slot);
            return `**${capitalize_string(slot)}**`;
        }
        return "";
    }
}
