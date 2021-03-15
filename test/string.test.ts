/// <reference types="jest" />

import { capitalize_string } from "../src/string";

describe("String functions", () => {
    it("capitalizes a string", () => {
        expect(capitalize_string("aAa")).toBe("AAa");
    });
});
