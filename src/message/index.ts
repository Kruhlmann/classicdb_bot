import { Message as DiscordMessage, Client, User, TextChannel, GroupDMChannel, DMChannel } from "discord.js";

interface ICodeMarkdownRemover {
    remove_markdown_code_content(content: string): string;
}

export interface IMessage {
    is_direct_message: boolean;
    is_own_message: boolean;
    is_empty: boolean;
    content: string;
    author: User;
    channel: TextChannel | GroupDMChannel | DMChannel;
}

export interface IMessageFactory {
    make_message_from_discord_api_message(message: DiscordMessage, client: Client): IMessage;
}

class CodeMarkdownRemover implements ICodeMarkdownRemover {
    private readonly SINGLE_CODE_MARKDOWN_REGEX = /`{1}[^`]+`{1}/g;
    private readonly MULTI_CODE_MARKDOWN_REGEX = /`{3}[^`]+`{3}/g;

    public remove_markdown_code_content(content: string): string {
        let result = content.replace(this.SINGLE_CODE_MARKDOWN_REGEX, "");
        result = result.replace(this.MULTI_CODE_MARKDOWN_REGEX, "");
        return result;
    }
}

export class Message implements IMessage {
    public readonly is_direct_message: boolean;
    public readonly is_own_message: boolean;
    public readonly is_empty: boolean;
    public readonly content: string;
    public readonly author: User;
    public readonly channel: TextChannel | GroupDMChannel | DMChannel;

    public constructor(
        is_direct_message: boolean,
        content: string,
        author: User,
        channel: TextChannel | GroupDMChannel | DMChannel,
        is_own_message: boolean
    ) {
        this.is_direct_message = is_direct_message;
        this.content = content;
        this.is_empty = this.content === "";
        this.author = author;
        this.channel = channel;
        this.is_own_message = is_own_message;
    }
}

export class MessageFactory {
    private readonly code_markdown_remover: ICodeMarkdownRemover;

    public constructor() {
        this.code_markdown_remover = new CodeMarkdownRemover();
    }

    public make_message_from_discord_api_message(message: DiscordMessage, client: Client): IMessage {
        const is_direct_message = message.guild === undefined;
        const content = this.code_markdown_remover.remove_markdown_code_content(message.content);
        const is_own_message = message.author.id === client.user.id;
        return new Message(is_direct_message, content, message.author, message.channel, is_own_message);
    }
}
