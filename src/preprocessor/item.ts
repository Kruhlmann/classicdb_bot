export class StatPreprocessor {
    protected readonly stat_type: string;
    protected readonly spell_description_prefix: string;

    public constructor(stat_type: string, spell_description_prefix: string) {
        this.stat_type = stat_type;
        this.spell_description_prefix = spell_description_prefix;
    }

    public preprocess(item: any, stat_index: number): any {
        const stat = item.preview_item.stats[stat_index];
        if (stat.type.type !== this.stat_type) {
            return item;
        }
        if (item.preview_item.spells === undefined) {
            item.preview_item.spells = [];
        }
        item.preview_item.spells.unshift({
            spell: { id: 0 },
            description: `${this.spell_description_prefix} ${stat.value}`,
        });
        item.preview_item.stats.splice(stat_index, 1);
        return item;
    }
}

export class ItemPreprocessor {
    protected readonly stat_preprocessors: StatPreprocessor[];
    public constructor() {
        this.stat_preprocessors = [
            new StatPreprocessor("DEFENSE_SKILL_RATING", "Equip: Increases defense rating by"),
            new StatPreprocessor("CRIT_RATING", "Equip: Improves critical strike rating by"),
            new StatPreprocessor("HIT_RATING", "Equip: Improves hit rating by"),
            new StatPreprocessor("EXPERTISE_RATING", "Equip: Increases your expertise rating by"),
            new StatPreprocessor("CRIT_SPELL_RATING", "Equip: Improves spell critical strike rating by"),
            new StatPreprocessor("HIT_SPELL_RATING", "Equip: Improves spell hit rating by"),
        ];
    }

    public preprocess(item: any): any {
        if (item.preview_item.stats !== undefined) {
            for (const preprocessor of this.stat_preprocessors) {
                let stat_index = item.preview_item.stats.length;
                while (stat_index--) {
                    item = preprocessor.preprocess(item, stat_index);
                }
            }
        }
        return item;
    }
}
