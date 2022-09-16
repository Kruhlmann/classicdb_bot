import { ColorResolvable } from "discord.js";
import { ItemQuality } from "./quality";

export class QualityColor {
    protected static readonly QUALITY_COLOR_TABLE: Record<ItemQuality, ColorResolvable> = {
        Poor: 0x9d9d9d,
        Common: 0xffffff,
        Uncommon: 0x1eff00,
        Rare: 0x0070dd,
        Epic: 0xa335ee,
        Legendary: 0xff8000,
        Artifact: 0xe6cc80,
    };
    protected readonly quality: ItemQuality;

    public constructor(quality: ItemQuality) {
        this.quality = quality;
    }

    public get_color(): ColorResolvable {
        return QualityColor.QUALITY_COLOR_TABLE[this.quality];
    }
}
