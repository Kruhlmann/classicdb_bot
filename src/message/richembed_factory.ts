import { Item } from "../item";
import { RichEmbed } from "discord.js";

export class RichEmbedFactory {
    //https://classicdb.ch/templates/wowhead/images/favicon.ico
    private readonly favicon_path: string;
    private readonly discord_invite_url: string;
    private readonly discord_icon_url: string;

    public constructor(favicon_path: string, discord_invite_url: string, discord_icon_url: string) {
        this.favicon_path = favicon_path;
        this.discord_invite_url = discord_invite_url;
        this.discord_icon_url = discord_icon_url;
    }

    public make_richembed_from_item(item: Item): RichEmbed {
        return new RichEmbed()
            .setTitle(item.name)
            .setColor("#ffffff")
            .setDescription("")
            .setAuthor("ClassicDB Bot", this.favicon_path, this.discord_invite_url)
            .setThumbnail(item.thumbnail)
            .setFooter(this.discord_invite_url)
            .setURL(item.url);
    }
}
