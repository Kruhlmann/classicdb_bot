import {
    Message as DiscordMessage,
    Client as DiscordAPIClient,
    User as DiscordUser,
    TextChannel,
    GroupDMChannel,
    DMChannel,
    RichEmbed,
} from "discord.js";

const SINGLE_CODE_MARKDOWN_REGEX = /`{1}[^`]+`{1}/g;
const MULTI_CODE_MARKDOWN_REGEX = /`{3}[^`]+`{3}/g;

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

    public static replace_code_markdown_content(
        message_content: string
    ): string {
        return message_content
            .replace(SINGLE_CODE_MARKDOWN_REGEX, "")
            .replace(MULTI_CODE_MARKDOWN_REGEX, "");
    }

    public static from_discord_api_message(
        message: DiscordMessage,
        client: DiscordAPIClient
    ): Message {
        const is_direct_message = !!message.guild;
        const content = Message.replace_code_markdown_content(message.content);
        const is_own_message = message.author.id === client.user.id;
        return new Message(
            is_direct_message,
            content,
            message.author,
            message.channel,
            is_own_message
        );
    }
}
