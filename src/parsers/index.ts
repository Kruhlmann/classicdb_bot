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

export abstract class MonoRegexHTMLTooltipBodyParser<ParserResultType> extends HTMLTooltipBodyParser<ParserResultType> {
    protected abstract readonly pattern: RegExp;
    protected abstract readonly default_value: ParserResultType;

    public async parse(): Promise<ParserResultType> {
        const matches = this.tooltip_table_html.match(this.pattern);
        if (!matches) {
            return this.default_value;
        }
        return this.postformat(matches);
    }

    protected abstract postformat(parse_result: string[]): ParserResultType;
}

export abstract class MultiRegexHTMLTooltipBodyParser<ParserResultType> extends HTMLTooltipBodyParser<
    ParserResultType[]
> {
    protected abstract readonly pattern: RegExp;

    public async parse(): Promise<ParserResultType[]> {
        const results: ParserResultType[] = [];

        let match;
        do {
            match = this.pattern.exec(this.tooltip_table_html);
            if (!match) {
                break;
            }
            const result = this.postformat(match);
            if (result) {
                results.push(result);
            }
        } while (match);

        return results;
    }

    protected abstract postformat(parse_result: string[]): ParserResultType | undefined;
}
