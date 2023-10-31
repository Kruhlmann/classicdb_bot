import { MessageEmbed } from "discord.js";

import { WOW_ITEM_COLORS } from "./color_table";

export class EmbedBuilder {
    protected embed: MessageEmbed;
    protected description: string[];

    public constructor() {
        this.embed = new MessageEmbed();
        this.description = [];
    }

    public set_quality(quality: { type: string } | undefined): this {
        if (quality !== undefined && quality.type in WOW_ITEM_COLORS) {
            this.embed.setColor(WOW_ITEM_COLORS[quality.type]);
        }
        return this;
    }

    public set_name(name: string | undefined): this {
        if (name !== undefined) {
            this.embed.setTitle(name);
        }
        return this;
    }

    public set_url(url: string | undefined): this {
        if (url !== undefined) {
            this.embed.setURL(url);
        }
        return this;
    }

    public set_icon(icon_path: string | undefined): this {
        if (icon_path !== undefined) {
            this.embed.setThumbnail(icon_path);
        }
        return this;
    }

    public set_binding(binding: { name: string } | undefined): this {
        if (binding !== undefined) {
            this.description.push(binding.name);
        }
        return this;
    }

    public set_unique(unique: string | undefined): this {
        if (unique !== undefined) {
            this.description.push(unique);
        }
        return this;
    }

    public set_inventory_class(
        inventory_type: { name: string } | undefined,
        subclass: { name: string } | undefined,
        is_subclass_hidden: boolean | undefined,
    ): this {
        if (inventory_type !== undefined && subclass !== undefined && !is_subclass_hidden) {
            this.description.push(`**${inventory_type.name} ${subclass.name}**`);
        } else if (inventory_type !== undefined) {
            this.description.push(`**${inventory_type.name}**`);
        }
        return this;
    }

    public set_durability(durability: { display_string: string }): this {
        if (durability !== undefined) {
            this.description.push(durability.display_string);
        }
        return this;
    }

    public set_weapon(
        weapon:
            | {
                  damage: { display_string: string };
                  attack_speed: { display_string: string };
                  dps: { display_string: string };
              }
            | undefined,
    ): this {
        if (weapon !== undefined) {
            this.description.push(
                `**${weapon.damage.display_string}**`,
                `**${weapon.attack_speed.display_string}**`,
                `**${weapon.dps.display_string}**`,
            );
        }
        return this;
    }

    public set_stats(stats: Array<{ type: { name: string }; value: number }> | undefined): this {
        if (stats !== undefined) {
            for (const stat of stats) {
                const sign = stat.value > 0 ? "+" : "";
                this.description.push(`${sign}${stat.value} ${stat.type.name}`);
            }
        }
        return this;
    }

    public set_description(description: string | undefined): this {
        if (description !== undefined) {
            this.description.push("", `_"${description}"_`);
        }
        return this;
    }

    public set_class_requirement(requirements: { playable_classes?: { display_string: string } } | undefined): this {
        if (requirements !== undefined && requirements.playable_classes !== undefined) {
            this.description.push(`**${requirements.playable_classes.display_string}**`);
        }
        return this;
    }

    public set_faction_requirement(requirements: { reputation?: { display_string: string } } | undefined): this {
        if (requirements !== undefined && requirements.reputation !== undefined) {
            this.description.push(`**${requirements.reputation.display_string}**`);
        }
        return this;
    }

    public set_itemset(
        set:
            | {
                  items: Array<{ item: { name: string; id: number } }>;
                  effects: Array<{ display_string: string }>;
                  display_string: string;
              }
            | undefined,
    ): this {
        if (set !== undefined) {
            this.description.push("", `**__${set.display_string}__**`);
            for (const item of set.items) {
                this.description.push(`· _[  ${item.item.name}](https://tbc.wowhead.com/item=${item.item.id})_`);
            }
            this.description.push("");
            for (const effect of set.effects) {
                this.description.push(effect.display_string);
            }
        }
        return this;
    }

    public set_shield_block(shield_block: { display: { display_string: string } }): this {
        if (shield_block !== undefined) {
            this.description.push(shield_block.display.display_string);
        }
        return this;
    }

    public set_level_requirement(requirements: { level?: { display_string: string } } | undefined): this {
        if (requirements !== undefined && requirements.level !== undefined) {
            this.description.push(requirements.level.display_string);
        }
        return this;
    }

    public set_spells(spells: Array<{ spell: { id: number }; description: string }> | undefined): this {
        if (spells !== undefined) {
            for (const spell of spells) {
                this.description.push(`[${spell.description}](https://tbc.wowhead.com/spell=${spell.spell.id})`);
            }
        }
        return this;
    }

    public set_armor(armor: { display: { display_string: string } } | undefined): this {
        if (armor !== undefined) {
            this.description.push(armor.display.display_string);
        }
        return this;
    }

    public set_version(version: string): this {
        this.embed.addField("Version", version);
        return this;
    }

    public set_footer(image_url: string, footer_text: string): this {
        this.embed.setFooter({ iconURL: image_url, text: footer_text });
        return this;
    }

    public get(): MessageEmbed {
        this.embed.setDescription(this.description.join("\n"));
        return this.embed;
    }
}
