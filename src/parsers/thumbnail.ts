import { HTMLParser } from ".";

abstract class ThumbnailParser extends HTMLParser<string> {
    public static icon_creation_javascript_pattern = /\(Icon.create\('(.*?)'.*?\)\)/;

    public async parse(): Promise<string> {
        const icon_creation_match = this.page_html_source.match(ThumbnailParser.icon_creation_javascript_pattern);
        if (!icon_creation_match || icon_creation_match.length < 2) {
            return "";
        }
        const item_thumbnail_id = icon_creation_match[1].toLowerCase();
        return this.item_thumbnail_id_to_url(item_thumbnail_id);
    }

    protected abstract item_thumbnail_id_to_url(item_thumbnail_id: string): string;
}

export class ClassicDBThumbnailParser extends ThumbnailParser {
    protected item_thumbnail_id_to_url(item_thumbnail_id: string): string {
        return `https://classicdb.ch/images/icons/large/${item_thumbnail_id}.jpg`;
    }
}

export class TBCDBThumbnailParser extends ThumbnailParser {
    protected item_thumbnail_id_to_url(item_thumbnail_id: string): string {
        return `https://tbcdb.com/images/icons/large/${item_thumbnail_id}.jpg`;
    }
}
