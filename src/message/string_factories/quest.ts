import { GameObjectPropertyStringFactory } from ".";

export class QuestStartStringFactory extends GameObjectPropertyStringFactory<{
    starts_quest: string;
}> {
    public build(): string {
        if (this.game_object.starts_quest === "") {
            return "";
        }
        return `**[Starts a quest](${this.game_object.starts_quest})**`;
    }
}

export class QuestItemStringFactory extends GameObjectPropertyStringFactory<{ is_quest_item: boolean }> {
    public build(): string {
        if (!this.game_object.is_quest_item) {
            return "";
        }
        return "Quest Item";
    }
}
