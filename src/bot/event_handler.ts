import { Client } from "discord.js";

import { ClassicDBBot } from ".";
import { Message } from "./message";
import { ItemQueryProcessor } from "./item_processor";
import { Expansion } from "../expansion";
import { MessageHandler } from "./message_handler";

class MessageRelevancyEvaluater {
    public readonly discord_api_client: Client;

    public constructor(discord_api_client: Client) {
        this.discord_api_client = discord_api_client;
    }

    public is_message_relevant(message?: Message): boolean {
        if (!message) {
            return false;
        }
        const is_bot_message = message.author.id === this.discord_api_client.user.id;
        return !message.is_direct_message && !message.is_empty && !is_bot_message;
    }
}

export class DiscordEventHandler {
    private readonly DISCORD_READY_EVENT_NAME = "ready";
    private readonly DISCORD_MESSAGE_EVENT_NAME = "message";
    private readonly bot: ClassicDBBot;
    private readonly message_handler: MessageHandler;
    private readonly message_relevancy_evaluator: MessageRelevancyEvaluater;

    public constructor(bot: ClassicDBBot) {
        this.bot = bot;
        this.message_relevancy_evaluator = new MessageRelevancyEvaluater(bot.discord_api_client);
        this.message_handler = new MessageHandler();
    }

    public register_on_ready_event_handler(): void {
        this.bot.discord_api_client.on(this.DISCORD_READY_EVENT_NAME, () => {
            console.log("Discord API client ready");
        });
    }

    public register_on_message_event_handler(): void {
        this.bot.discord_api_client.on(this.DISCORD_MESSAGE_EVENT_NAME, (message) => {
            const converted_message = Message.from_discord_api_message(message, this.bot.discord_api_client);
            const message_is_relevant = this.message_relevancy_evaluator.is_message_relevant(converted_message);
            if (message_is_relevant) {
                this.message_handler.act_on_message(converted_message);
            }
        });
    }
}
