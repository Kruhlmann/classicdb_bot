import { DMChannel, GroupDMChannel, Message as DiscordMessage, TextChannel, User } from "discord.js";

export interface IMessage {
    is_direct_message: boolean;
    is_own_message: boolean;
    is_empty: boolean;
    content: string;
    author: User;
    channel: TextChannel | GroupDMChannel | DMChannel;
    original_message: DiscordMessage;
}

export class Message implements IMessage {
    public readonly is_direct_message: boolean;
    public readonly is_own_message: boolean;
    public readonly is_empty: boolean;
    public readonly content: string;
    public readonly author: User;
    public readonly channel: TextChannel | GroupDMChannel | DMChannel;
    public readonly original_message: DiscordMessage;

    public constructor(
        is_direct_message: boolean,
        content: string,
        author: User,
        channel: TextChannel | GroupDMChannel | DMChannel,
        is_own_message: boolean,
        original_message: DiscordMessage,
    ) {
        this.is_direct_message = is_direct_message;
        this.content = content;
        this.is_empty = this.content === "";
        this.author = author;
        this.channel = channel;
        this.is_own_message = is_own_message;
        this.original_message = original_message;
    }
}
