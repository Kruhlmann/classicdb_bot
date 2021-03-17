/// <reference types="jest" />
import { BindingParser, ItemBinding } from "../../src/parsers/binding";
import { item_page_sources } from "../resources";

describe("Binding parser", () => {
    describe("ClassicDB", () => {
        it("parses binding from classicdb.ch pickup-binding item page source", async () => {
            const parser = new BindingParser(item_page_sources.thunderfury.classicdb);
            const result = parser.parse();
            expect(result).toBe(ItemBinding.ON_PICKUP);
        });

        it("parses binding from classicdb.ch equip-binding item page source", async () => {
            const parser = new BindingParser(item_page_sources.shadowfang.classicdb);
            const result = parser.parse();
            expect(result).toBe(ItemBinding.ON_EQUIP);
        });

        it("parses binding from classicdb.ch non-binding item page source", async () => {
            const parser = new BindingParser(item_page_sources.barrel.classicdb);
            const result = parser.parse();
            expect(result).toBe(ItemBinding.NONE);
        });
    });

    describe("TBCDB", () => {
        it("parses binding from tbcdb.com pickup-binding item page source", async () => {
            const parser = new BindingParser(item_page_sources.thunderfury.tbcdb);
            const result = parser.parse();
            expect(result).toBe(ItemBinding.ON_PICKUP);
        });

        it("parses binding from tbcdb.com equip-binding item page source", async () => {
            const parser = new BindingParser(item_page_sources.shadowfang.tbcdb);
            const result = parser.parse();
            expect(result).toBe(ItemBinding.ON_EQUIP);
        });

        it("parses binding from tbcdb.com non-binding item page source", async () => {
            const parser = new BindingParser(item_page_sources.barrel.tbcdb);
            const result = parser.parse();
            expect(result).toBe(ItemBinding.NONE);
        });
    });
});
