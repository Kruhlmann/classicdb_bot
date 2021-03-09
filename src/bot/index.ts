import { Client } from "discord.js";
import { BotAlreadyStartedError } from "../exceptions";
import { DiscordEventHandler } from "./event_handler";

export class ClassicDBBot {
    private token: string;
    private has_started: boolean = false;
    private discord_event_handler: DiscordEventHandler;
    public discord_api_client: Client;

    public constructor(token: string) {
        this.token = token;
        this.discord_api_client = new Client();
        this.discord_event_handler = new DiscordEventHandler(this);
    }

    public async start(): Promise<string> {
        this.throw_error_if_bot_has_started();
        this.has_started = true;
        this.discord_event_handler.register_on_ready_event_handler();
        this.discord_event_handler.register_on_message_event_handler();
        return this.discord_api_client.login(this.token);
    }

    private throw_error_if_bot_has_started(): void {
        if (this.has_started) {
            throw new BotAlreadyStartedError();
        }
    }
}
