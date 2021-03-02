import { SQLiteDatabaseConnection } from "./db";
import {
    Client as DiscordAPIClient,
    Message as DiscordMessage,
} from "discord.js";
import { BotAlreadyStartedError } from "./exceptions";
import { Message } from "./message";

export const DISCORD_READY_EVENT_NAME = "ready";
export const DISCORD_MESSAGE_EVENT_NAME = "ready";

export class ClassicDBBot {
    private token: string;
    private has_started: boolean = false;
    private database: SQLiteDatabaseConnection;
    private discord_api_client: DiscordAPIClient;

    public constructor(token: string, sqlite_database_path: string) {
        this.token = token;
        this.discord_api_client = new DiscordAPIClient();
        this.database = new SQLiteDatabaseConnection(sqlite_database_path);
    }

    public start(): void {
        this.throw_error_if_bot_has_started();
        this.has_started = true;
        this.discord_api_client.login(this.token);
        this.register_ready_event_handler();
        this.register_message_event_handler();
    }

    private register_ready_event_handler(): void {
        this.discord_api_client.on(DISCORD_READY_EVENT_NAME, () => {
            console.log("Started ClassicDBBot");
        });
    }

    private process_discord_channel_message(message: Message): void {
        console.log(message);
    }

    private should_ignore_message(message: Message) {
        const is_bot_message =
            message.author.id === this.discord_api_client.user.id;
        return message.is_direct_message || message.is_empty || is_bot_message;
    }

    private process_discord_channel_message_if_relevant(
        message: Message
    ): void {
        const should_ignore_message = this.should_ignore_message(message);
        if (!should_ignore_message) {
            this.process_discord_channel_message(message);
        }
    }

    private register_message_event_handler(): void {
        this.discord_api_client.on(
            DISCORD_MESSAGE_EVENT_NAME,
            (message: DiscordMessage) => {
                const converted_message = Message.from_discord_api_message(
                    message,
                    this
                );
                this.process_discord_channel_message_if_relevant(
                    converted_message
                );
            }
        );
    }

    private throw_error_if_bot_has_started(): void {
        if (this.has_started) {
            throw new BotAlreadyStartedError();
        }
    }
}
