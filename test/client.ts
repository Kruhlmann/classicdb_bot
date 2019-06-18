/**
 * @fileoverview Discord client for unit tests.
 * @author Andreas Kruhlmann
 * @since 1.2.3
 */

import * as discord from "discord.js";
const config_path = `${__dirname}/../config.json`;
import * as fs from "fs";
const config = JSON.parse(fs.readFileSync(config_path, "utf8"));

export async function create_client(): Promise<discord.Client> {
    return new Promise((resolve, reject) => {
        // Init discord virtual client.
        const discord_client = new discord.Client();
        const dicord_token = config.deployment_mode === "production"
            ? config.discord_bot_token.production
            : config.discord_bot_token.development;

        discord_client.login(dicord_token).catch(() => reject());

        discord_client.on("ready", () => {
            resolve(discord_client);
        });
    });
}

export function find_channel(client: discord.Client,
                             channel_id: string): discord.Channel {
    return client.channels.find((channel) => {
        return channel.id === channel_id;
    });
}
