import { ColorResolvable } from "discord.js";

import { ItemQuality } from "./quality";

export class QualityColor {
    protected static readonly QUALITY_COLOR_TABLE: Record<ItemQuality, ColorResolvable> = {
        Poor: 0x9D_9D_9D,
        Common: 0xFF_FF_FF,
        Uncommon: 0x1E_FF_00,
        Rare: 0x00_70_DD,
        Epic: 0xA3_35_EE,
        Legendary: 0xFF_80_00,
        Artifact: 0xE6_CC_80,
    };
    protected readonly quality: ItemQuality;

    public constructor(quality: ItemQuality) {
        this.quality = quality;
    }

    public get_color(): ColorResolvable {
        return QualityColor.QUALITY_COLOR_TABLE[this.quality];
    }
}
