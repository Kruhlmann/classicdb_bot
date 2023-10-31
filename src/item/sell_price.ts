export class SellPrice {
    protected readonly gold_price: number;
    protected readonly silver_price: number;
    protected readonly copper_price: number;

    public constructor(price: number) {
        this.gold_price = Math.floor(price / 10_000) % 100;
        this.silver_price = Math.floor(price / 100) % 100;
        this.copper_price = Math.floor(price) % 100;
    }

    public toString(): string {
        if (this.gold_price + this.silver_price + this.copper_price === 0) {
            return "*Not sellable*";
        }
        const buffer: string[] = [];
        if (this.gold_price > 0) {
            buffer.push(`<:moneygold:1020313755684438036>  ${this.gold_price}`);
        }
        if (this.silver_price > 0) {
            buffer.push(`<:moneysilver:1020313768967807046> ${this.silver_price}`);
        }
        buffer.push(`<:moneycopper:1020313738059976765> ${this.copper_price}`);
        return buffer.join(" ");
    }
}
