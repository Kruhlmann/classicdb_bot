import { Parser } from ".";

export class ThumbnailParser extends Parser<string> {
    public static icon_creation_javascript_pattern = /\(Icon.create\('(.*?)'.*?\)\)/;

    public async parse(): Promise<string> {
        const icon_creation_match = this.page_html_source.match(ThumbnailParser.icon_creation_javascript_pattern);
        return "";
    }
}
