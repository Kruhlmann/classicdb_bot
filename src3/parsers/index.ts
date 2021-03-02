export abstract class Parser<ParserResultType> {
    protected readonly page_html_source: string;

    public constructor(page_html_source: string) {
        this.page_html_source = page_html_source;
    }

    public abstract parse(): ParserResultType;
}
