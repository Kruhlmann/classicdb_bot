import { MessageEmbed } from "discord.js";
import { WOW_ITEM_COLORS } from "./color_table";

export class EmbedBuilder {
    protected embed: MessageEmbed;

    public constructor() {
        this.embed = new MessageEmbed();
    }

    public set_quality(quality: string | undefined): this {
        if (quality in Object.keys(WOW_ITEM_COLORS)) {
            this.embed.setTitle(WOW_ITEM_COLORS[quality]);
        }
        return this;
    }

    public set_name(name: string | undefined): this {
        if (name !== undefined) {
            this.embed.setTitle(name);
        }
        return this;
    }

    public set_invite_link(invite_link: string | undefined): this {
        if (invite_link !== undefined) {
            this.embed.setURL(invite_link);
        }
        return this;
    }

    public set_icon(icon_path: string | undefined): this {
        if (icon_path !== undefined) {
            this.embed.setThumbnail(icon_path);
        }
        return this;
    }

    public get(): MessageEmbed {
        return this.embed;
    }
}
