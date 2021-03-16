import { Client, Message as DiscordAPIMessage } from "discord.js";

import { IClassicDBBot } from ".";
import { MessageHandler, IMessageHandler } from "../message/handler";
import { IMessageRelevancyEvaluater, MessageRelevancyEvaluater } from "../message/relevancy_evaluator";
import { MessageFactory, IMessageFactory } from "../message/factory";

export interface IDiscordEventHandler {
    register_on_ready_event_handler(): void;
    register_on_message_event_handler(): void;
}

export class DiscordEventHandler implements IDiscordEventHandler {
    private readonly DISCORD_READY_EVENT_NAME = "ready";
    private readonly DISCORD_MESSAGE_EVENT_NAME = "message";
    private readonly bot: IClassicDBBot;
    private readonly message_handler: IMessageHandler;
    private readonly message_relevancy_evaluator: IMessageRelevancyEvaluater;
    private readonly message_factory: IMessageFactory;

    public constructor(bot: IClassicDBBot) {
        this.bot = bot;
        this.message_relevancy_evaluator = new MessageRelevancyEvaluater(bot.discord_api_client);
        this.message_handler = new MessageHandler();
        this.message_factory = new MessageFactory();
    }

    public register_on_ready_event_handler(): void {
        this.bot.discord_api_client.on(this.DISCORD_READY_EVENT_NAME, () => {
            console.log("Discord API client ready");
        });
    }

    public register_on_message_event_handler(): void {
        this.bot.discord_api_client.on(this.DISCORD_MESSAGE_EVENT_NAME, (discord_message: DiscordAPIMessage) => {
            const message = this.message_factory.make_from_discord_api_message(
                discord_message,
                this.bot.discord_api_client
            );
            const message_is_relevant = this.message_relevancy_evaluator.is_message_relevant(message);
            if (message_is_relevant) {
                this.message_handler.act_on_message(message);
            }
        });
    }
}
