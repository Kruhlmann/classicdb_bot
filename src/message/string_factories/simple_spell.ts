import { ISpell } from "../../spell";
import { GameObjectPropertyStringFactory } from ".";

export class SpellSummaryTextStringFactory extends GameObjectPropertyStringFactory<{
    spells: ISpell[];
}> {
    public build(): string {
        return this.game_object.spells
            .map((spell) => {
                return this.spell_to_string(spell);
            })
            .join("\n");
    }

    private spell_to_string(spell: ISpell): string {
        if (spell.is_simple) {
            return `[${spell.trigger}: ${spell.description}](${spell.url})`;
        }
        return `[${spell.trigger}: ${spell.name}](${spell.url})`;
    }
}
