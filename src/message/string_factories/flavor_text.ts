import { ItemPropertyStringFactory } from ".";

export class FlavorTextStringFactory extends ItemPropertyStringFactory<{ flavor_text: string }> {
    public build(): string {
        if (this.item.flavor_text === "") {
            return "";
        }
        return `───\n*${this.item.flavor_text}*`;
    }
}
