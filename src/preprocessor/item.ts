export class ItemPreprocessor {
    public preprocess(item: any): any {
        let stat_index = item.preview_item.stats.length;
        while (stat_index--) {
            const stat = item.preview_item.stats[stat_index];
            if (stat.type.type === "DEFENSE_SKILL_RATING") {
                if (item.preview_item.spells === undefined) {
                    item.preview_item.spells = [];
                }
                item.preview_item.spells.unshift({
                    spell: { id: 0 },
                    description: `Equip: Increases defense rating by ${stat.value}`,
                });
                item.preview_item.stats.splice(stat_index, 1);
            }
        }
        return item;
    }
}
