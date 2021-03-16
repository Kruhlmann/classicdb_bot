import { Client } from "discord.js";
import { AlreadyStartedError } from "../exceptions";
import { DiscordEventHandler, IDiscordEventHandler } from "./event_handler";

export interface IStartable {
    start(): Promise<void>;
}

export interface IClassicDBBot {
    discord_api_client: Client;
    start(): Promise<void>;
}

abstract class Startable {
    protected has_started = false;

    public async start(): Promise<void> {
        if (this.has_started) {
            throw new AlreadyStartedError();
        }
        this.has_started = true;
    }
}

export class ClassicDBBot extends Startable {
    private readonly token: string;
    private readonly discord_event_handler: IDiscordEventHandler;
    public readonly discord_api_client: Client;

    public constructor(token: string) {
        super();
        this.token = token;
        this.discord_api_client = new Client();
        this.discord_event_handler = new DiscordEventHandler(this);
    }

    public async start(): Promise<void> {
        super.start();
        this.discord_event_handler.register_on_ready_event_handler();
        this.discord_event_handler.register_on_message_event_handler();
        this.discord_api_client.login(this.token);
    }
}
