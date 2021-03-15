import { ItemStringFactory } from ".";

export class FlavorTextStringFactory extends ItemStringFactory {
    public build(): string {
        if (this.item.flavor_text === "") {
            return "";
        }
        return `*${this.item.flavor_text}*`;
    }
}
