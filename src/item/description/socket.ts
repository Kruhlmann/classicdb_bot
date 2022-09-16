import { ItemTooltip } from "../tooltip";
import { DescriptionFieldParser } from "./field_parser";

export class SocketDescriptionFieldParser implements DescriptionFieldParser {
    protected readonly socket_type: string;
    protected readonly socket_emoji: string;

    public constructor(socket_type: string, socket_emoji: string) {
        this.socket_type = socket_type;
        this.socket_emoji = socket_emoji;
    }

    public qualifies(field: ItemTooltip): boolean {
        return field.label === `${this.socket_type} Socket`;
    }

    public mutate_label(_field: ItemTooltip): string {
        return `${this.socket_emoji} ${this.socket_type} Socket`;
    }
}
