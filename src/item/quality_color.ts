import { ColorResolvable } from "discord.js";

import { ItemQuality } from "./quality";

export class QualityColor {
    protected static readonly QUALITY_COLOR_TABLE: Record<ItemQuality, ColorResolvable> = {
        Poor: 0x9d_9d_9d,
        Common: 0xff_ff_ff,
        Uncommon: 0x1e_ff_00,
        Rare: 0x00_70_dd,
        Epic: 0xa3_35_ee,
        Legendary: 0xff_80_00,
        Artifact: 0xe6_cc_80,
    };
    protected readonly quality: ItemQuality;

    public constructor(quality: ItemQuality) {
        this.quality = quality;
    }

    public get_color(): ColorResolvable {
        return QualityColor.QUALITY_COLOR_TABLE[this.quality];
    }
}
