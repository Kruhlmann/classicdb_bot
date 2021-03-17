import { Client, Message as DiscordAPIMessage } from "discord.js";

import { IMessage, Message } from ".";

interface ICodeMarkdownRemover {
    remove_markdown_code_content(content: string): string;
}

export interface IMessageFactory {
    make_from_discord_api_message(message: DiscordAPIMessage, client: Client): IMessage;
}

class CodeMarkdownRemover implements ICodeMarkdownRemover {
    private readonly SINGLE_CODE_MARKDOWN_REGEX = /`[^`]+`/g;
    private readonly MULTI_CODE_MARKDOWN_REGEX = /`{3}[^`]+`{3}/g;

    public remove_markdown_code_content(content: string): string {
        let result = content.replace(this.SINGLE_CODE_MARKDOWN_REGEX, "");
        result = result.replace(this.MULTI_CODE_MARKDOWN_REGEX, "");
        return result;
    }
}
export class MessageFactory {
    private readonly code_markdown_remover: ICodeMarkdownRemover;

    public constructor() {
        this.code_markdown_remover = new CodeMarkdownRemover();
    }

    public make_from_discord_api_message(message: DiscordAPIMessage, client: Client): IMessage {
        const is_direct_message = message.guild === undefined;
        const content = this.code_markdown_remover.remove_markdown_code_content(message.content);
        const is_own_message = message.author.id === client.user.id;
        return new Message(is_direct_message, content, message.author, message.channel, is_own_message);
    }
}
