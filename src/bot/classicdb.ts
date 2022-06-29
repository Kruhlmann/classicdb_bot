import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Client } from "discord.js";
import { SingleInstanceStartable } from "../concurrency/single_instance_startable";
import { SlashCommandBuilder } from "@discordjs/builders";
import { EmbedBuilder } from "../message/embed_builder";
import { Logger } from "../logging/logger";
const {
    BattleNetClient,
    BattleNetOauthService,
    BattleNetNamespace,
    BattleNetBaseNamespace,
    BattleNetRegion,
} = require("@kruhlmann/battlenetjs");

export class ClassicDBBot extends SingleInstanceStartable {
    protected readonly token: string;
    protected readonly client_id: string;
    protected readonly logger: Logger;
    protected readonly rest_api: REST;
    protected readonly slash_commands: unknown[];
    protected readonly discord_api_client: Client;
    protected readonly battlenet: typeof BattleNetClient;

    public constructor(
        token: string,
        client_id: string,
        rest_api_version: string,
        logger: Logger,
        slash_commands: unknown[],
    ) {
        super();
        this.token = token;
        this.client_id = client_id;
        this.logger = logger;
        this.discord_api_client = new Client({ intents: [] });
        this.rest_api = new REST({ version: rest_api_version }).setToken(this.token);
        this.slash_commands = slash_commands;
        const ns = new BattleNetNamespace(
            BattleNetBaseNamespace.WOW_CLASSIC_PROGRESSION,
            BattleNetRegion.NORTH_AMERICA,
        );
        const service = new BattleNetOauthService(process.env.BATTLENET_CLIENT_ID, process.env.BATTLENET_CLIENT_SECRET);
        this.battlenet = new BattleNetClient(service, ns);
    }

    public async register_slash_commands(slash_commands: unknown[]): Promise<void> {
        const commands = [
            new SlashCommandBuilder()
                .setName("item")
                .setDescription("Search for an item.")
                .addStringOption((option) =>
                    option.setName("query").setDescription("Item name or ID").setRequired(true),
                ),
        ].map((command) => command.toJSON());
        try {
            await this.rest_api.put(Routes.applicationCommands(this.client_id), { body: commands });
            this.logger.debug(`Successfully registered ${slash_commands.length} slash commands.`);
        } catch (error) {
            this.logger.error(`Unable to register slash commands (${error}).`);
            throw error;
        }
    }

    protected register_events(): void {
        this.discord_api_client.once("ready", (client: { user: { tag: string } }) => {
            this.logger.log(`Bot logged in as '${client.user.tag}'.`);
        });
        this.discord_api_client.on("interactionCreate", async (interaction) => {
            if (!interaction.isCommand()) {
                return;
            }
            if (interaction.commandName !== "item") {
                return;
            }
            await interaction.deferReply();
            const query = interaction.options.getString("query").trim();
            const item_promise = /^-?\d+$/.test(query)
                ? this.battlenet.get_item_by_id(Number.parseInt(query))
                : this.battlenet.get_item_by_name(query);
            await item_promise
                .then((item: any) => {
                    console.log(item);
                    this.logger.debug(`Found item '${item.name}' for query '${query}'`);
                    const embed = new EmbedBuilder()
                        .set_quality(item.quality.type)
                        .set_name(item.name)
                        .set_name(item.name)
                        .get();
                    return interaction.editReply({ embeds: [embed] });
                })
                .catch(() => {
                    this.logger.debug(`Found no item for query ${query}`);
                    return interaction.editReply("Sorry bud, I couldn't find that item.");
                });
        });
    }

    public async start(): Promise<void> {
        this.register_events();
        await super.start();
        await this.register_slash_commands(this.slash_commands);
        await this.discord_api_client
            .login(this.token)
            .then(() => {})
            .catch((error) => {
                this.logger.error(`Bot unable to authenticate ${error}`);
                throw error;
            });
    }
}
