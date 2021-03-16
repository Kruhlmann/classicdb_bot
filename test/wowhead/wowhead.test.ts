import { OpenAPIResponse, ClassicDB, TBCDB } from "../../src/wowhead";
import { MessageHandler } from "../../src/message/handler";
import { Expansion } from "../../src/expansion";
const thunderfury_query_response_classicdb: OpenAPIResponse = [
    "thunderfury",
    ["Thunderfury, Blessed Blade of the Windseeker (Item)", "Rise, Thunderfury! (Quest)"],
    [],
    [],
    [],
    [],
    [],
    [
        [3, 19019, "INV_Sword_39", 5],
        [5, 7787, 3],
    ],
];

const thunderfury_query_response_tbcdb = [
    "thunderfury",
    ["Rise, Thunderfury! (Quest)", "Thunderfury, Blessed Blade of the Windseeker (Item)"],
    [],
    [],
    [],
    [],
    [],
    [
        [5, 7787, 3],
        [3, 19019, "INV_Sword_39", 5],
    ],
];

describe("WowHead", () => {
    describe("ClassicDB", () => {
        it("parses id from an openapi response", () => {
            const wowhead = new ClassicDB("");
            const result = wowhead.get_id_of_first_item_in_nonempty_openapi_response(
                thunderfury_query_response_classicdb
            );
            expect(result).toBe(19019);
        });
    });

    describe("TBCDB", () => {
        it("parses id from an openapi response", () => {
            const wowhead = new TBCDB("");
            const result = wowhead.get_id_of_first_item_in_nonempty_openapi_response(thunderfury_query_response_tbcdb);
            expect(result).toBe(19019);
        });
    });
});
