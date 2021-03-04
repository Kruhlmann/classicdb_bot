import * as cheerio from "cheerio";

export abstract class HTMLParser<ParserResultType> {
    protected readonly page_html_source: string;

    public constructor(page_html_source: string) {
        this.page_html_source = page_html_source;
    }

    public abstract async parse(): Promise<ParserResultType>;
}

export abstract class HTMLTooltipBodyParser<ParserResultType> extends HTMLParser<ParserResultType> {
    protected readonly tooltip_table_html: string;
    protected readonly $: cheerio.Root;

    public constructor(page_html_source: string) {
        super(page_html_source);
        this.$ = cheerio.load(this.page_html_source);
        this.tooltip_table_html = this.$("div.tooltip table tr td table tr td").html();
    }
}
