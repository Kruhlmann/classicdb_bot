import {
    Message as DiscordMessage,
    Client as DiscordAPIClient,
    User as DiscordUser,
    TextChannel,
    GroupDMChannel,
    DMChannel,
} from "discord.js";

class CodeMarkdownRemover {
    private readonly SINGLE_CODE_MARKDOWN_REGEX = /`{1}[^`]+`{1}/g;
    private readonly MULTI_CODE_MARKDOWN_REGEX = /`{3}[^`]+`{3}/g;

    public remove_markdown_code_content(content: string) {
        let result = content.replace(this.SINGLE_CODE_MARKDOWN_REGEX, "");
        result = result.replace(this.MULTI_CODE_MARKDOWN_REGEX, "");
        return result;
    }
}

export class Message {
    public readonly is_direct_message: boolean;
    public readonly content: string;
    public readonly is_empty: boolean;
    public readonly author: DiscordUser;
    public readonly is_own_message: boolean;
    public readonly channel: TextChannel | GroupDMChannel | DMChannel;

    private constructor(
        is_direct_message: boolean,
        content: string,
        author: DiscordUser,
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

    public static from_discord_api_message(message: DiscordMessage, client: DiscordAPIClient): Message {
        const is_direct_message = message.guild === undefined;
        const markdown_remover = new CodeMarkdownRemover();
        const content = markdown_remover.remove_markdown_code_content(message.content);
        const is_own_message = message.author.id === client.user.id;
        return new Message(is_direct_message, content, message.author, message.channel, is_own_message);
    }
}
