import { Client, EmbedBuilder, SlashCommandBuilder, REST } from "discord.js";
import { Routes } from "discord-api-types/v9";

import { SingleInstanceStartable } from "../concurrency/single_instance_startable";
import { EpicTextDescriptionFieldParser } from "../item/description/epic_text";
import { DescriptionFieldParser } from "../item/description/field_parser";
import { IndentTextDescriptionFieldParser } from "../item/description/indent_text";
import { MiscTextDescriptionFieldParser } from "../item/description/misc_text";
import { PoorTextDescriptionFieldParser } from "../item/description/poor_text";
import { SocketDescriptionFieldParser } from "../item/description/socket";
import { SocketBonusDescriptionFieldParser } from "../item/description/socket_bonus";
import { UncommonTextDescriptionFieldParser } from "../item/description/uncommon_text";
import { QualityColor } from "../item/quality_color";
import { SellPrice } from "../item/sell_price";
import { get_autocomplete, get_items } from "../item/storage";
import { Logger } from "../logging/logger";
import { ItemPreprocessor } from "../preprocessor/item";

export class ClassicDBBot extends SingleInstanceStartable {
    protected readonly token: string;
    protected readonly client_id: string;
    protected readonly logger: Logger;
    protected readonly rest_api: REST;
    protected readonly slash_commands: unknown[];
    protected readonly discord_api_client: Client;
    protected readonly item_preprocessor: ItemPreprocessor;

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
        this.item_preprocessor = new ItemPreprocessor();
    }

    public async register_slash_commands(slash_commands: unknown[]): Promise<void> {
        const commands = [
            new SlashCommandBuilder()
                .setName("item")
                .setDescription("Search for an item.")
                .addStringOption((option) => {
                    return option
                        .setName("query")
                        .setDescription("Item name or ID")
                        .setRequired(true)
                        .setAutocomplete(true);
                }),
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
            if (interaction.isAutocomplete()) {
                if (interaction.commandName !== "item") {
                    this.logger.warning(`Unknown autocomplete command '${interaction.commandName}'`);
                    return;
                }
                const user_input = interaction.options.getFocused().toLowerCase();
                const choices: { name: string; value: string }[] = [];
                const autocomplete = get_autocomplete();
                for (const key of Object.keys(autocomplete)) {
                    if (key.includes(user_input)) {
                        choices.push(autocomplete[key]);
                    }
                    if (choices.length === 25) {
                        break;
                    }
                }
                await interaction.respond(choices);
            }
            if (!interaction.isCommand()) {
                return;
            }
            if (interaction.commandName !== "item") {
                return;
            }
            await interaction.deferReply();
            const query = (interaction.options as any).getString("query").trim();
            const found_item = /^-?\d+$/.test(query)
                ? get_items().find((item) => item.itemId.toString() === query)
                : get_items().find((item) => item.name.toLowerCase().includes(query.toLowerCase()));
            if (found_item === undefined) {
                this.logger.debug(`Found no item for query ${query}.`);
                interaction.editReply("Sorry bud, I couldn't find that item.");
                return;
            }
            const description_fields: string[] = [];
            found_item.tooltip.shift(); // Remove name tooltip field.
            found_item.tooltip.shift(); // Remove phase tooltip field.

            const field_parsers: DescriptionFieldParser[] = [
                new SocketDescriptionFieldParser("Prismatic", "<:socketprismatic:1020311745765576734>"),
                new SocketDescriptionFieldParser("Meta", "<:socketmeta:1020311695060635668>"),
                new SocketDescriptionFieldParser("Red", "<:socketred:1020311708583071805> "),
                new SocketDescriptionFieldParser("Blue", "<:socketblue:1020311671677386792>"),
                new SocketDescriptionFieldParser("Yellow", "<:socketyellow:1020311732519981136>"),
                new SocketBonusDescriptionFieldParser(),
                new MiscTextDescriptionFieldParser(),
                new PoorTextDescriptionFieldParser(),
                new UncommonTextDescriptionFieldParser(),
                new EpicTextDescriptionFieldParser(get_items()),
                new IndentTextDescriptionFieldParser(get_items()),
            ];

            for (const field of found_item.tooltip) {
                const relevant_parsers = field_parsers.filter((parser) => parser.qualifies(field));
                let label = field.label;
                for (const parser of relevant_parsers) {
                    label = parser.mutate_label(field);
                }

                if (field.format === "alignRight" && description_fields.length > 0) {
                    const last_field = description_fields.pop();
                    description_fields.push(`${last_field} ${label}`);
                } else {
                    description_fields.push(label);
                }
            }
            description_fields.push(`Sell price: ${new SellPrice(found_item.sellPrice)}`);
            const embed = new EmbedBuilder()
                .setTitle(found_item.name)
                .setURL(`https://wowhead.com/wotlk/item=${found_item.itemId}/`)
                .setColor(new QualityColor(found_item.quality).get_color())
                .setThumbnail(`https://wow.zamimg.com/images/wow/icons/large/${found_item.icon}.jpg`)
                .setDescription(description_fields.join("\n"));
            await interaction.editReply({ embeds: [embed] });
            return;
        });
    }

    public async start(): Promise<void> {
        this.register_events();
        await super.start();
        await this.register_slash_commands(this.slash_commands);
        await this.discord_api_client
            .login(this.token)
            .then(() => {
                this.logger.debug("Authentication successful");
            })
            .catch((error) => {
                this.logger.error(`Bot unable to authenticate ${error}`);
                throw error;
            });
    }
}
