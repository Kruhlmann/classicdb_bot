import { Client } from "discord.js";

import { IMessage } from ".";

export interface IMessageRelevancyEvaluater {
    discord_api_client: Client;
    is_message_relevant(message?: IMessage): boolean;
}

export class MessageRelevancyEvaluater implements IMessageRelevancyEvaluater {
    public readonly discord_api_client: Client;

    public constructor(discord_api_client: Client) {
        this.discord_api_client = discord_api_client;
    }

    // eslint-disable-next-line complexity
    public is_message_relevant(message?: IMessage): boolean {
        if (!message) {
            return false;
        }
        const is_bot_message = message.author.id === this.discord_api_client.user.id;
        return !message.is_direct_message && !message.is_empty && !is_bot_message;
    }
}
