import { Slot, SlotLookupTable, Type, TypeLookupTable } from "../../parsers/slot_type";
import { capitalize_string } from "../../string";
import { GameObjectPropertyStringFactory } from ".";

export class EquipmentStringFactory extends GameObjectPropertyStringFactory<{ slot: Slot; type: Type }> {
    public build(): string {
        if (this.game_object.slot !== Slot.NONE && this.game_object.type !== Type.NONE) {
            const slot = new SlotLookupTable().perform_reverse_lookup(this.game_object.slot);
            const type = new TypeLookupTable().perform_reverse_lookup(this.game_object.type);
            return `**${capitalize_string(slot)} ${capitalize_string(type)}**`;
        }
        if (this.game_object.slot !== Slot.NONE) {
            const slot = new SlotLookupTable().perform_reverse_lookup(this.game_object.slot);
            return `**${capitalize_string(slot)}**`;
        }
        return "";
    }
}
