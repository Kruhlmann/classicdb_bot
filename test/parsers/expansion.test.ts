/// <reference types="jest" />

import { ExpansionLookupTable, Expansion } from "../../src/expansion";

describe("Expansion", () => {
    it("Performs case-insensitive classic lookup", () => {
        const expansion_string = "classIC";
        const result = new ExpansionLookupTable().perform_lookup(expansion_string);
        expect(result).toBe(Expansion.CLASSIC);
    });

    it("Performs case-insensitive tbc lookup", () => {
        const expansion_string = "TBc";
        const result = new ExpansionLookupTable().perform_lookup(expansion_string);
        expect(result).toBe(Expansion.TBC);
    });
});
