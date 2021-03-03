import * as fs from "fs";

export const item_page_sources = {
    audacity: {
        classicdb: fs.readFileSync("res/test/classicdb_alexs_ring_of_audacity_item_page.html").toString(),
        tbcdb: fs.readFileSync("res/test/tbcdb_alexs_ring_of_audacity_item_page.html").toString(),
    },
    thunderfury: {
        classicdb: fs.readFileSync("res/test/classicdb_thunderfury_item_page.html").toString(),
        tbcdb: fs.readFileSync("res/test/tbcdb_thunderfury_item_page.html").toString(),
    },
    quelserrar: {
        classicdb: fs.readFileSync("res/test/classicdb_quelserrar_item_page.html").toString(),
        tbcdb: fs.readFileSync("res/test/tbcdb_quelserrar_item_page.html").toString(),
    },
    cenarius: {
        classicdb: fs.readFileSync("res/test/classicdb_band_of_cenarius.html").toString(),
        tbcdb: fs.readFileSync("res/test/tbcdb_band_of_cenarius.html").toString(),
    },
    nozdormu: {
        classicdb: fs.readFileSync("res/test/classicdb_agent_of_nozdormu.html").toString(),
        tbcdb: fs.readFileSync("res/test/tbcdb_agent_of_nozdormu.html").toString(),
    },
    bloodcap: {
        classicdb: fs.readFileSync("res/test/classicdb_bloodcap.html").toString(),
        tbcdb: fs.readFileSync("res/test/tbcdb_bloodcap.html").toString(),
    },
    barrel: {
        classicdb: fs.readFileSync("res/test/classicdb_empty_barrel.html").toString(),
        tbcdb: fs.readFileSync("res/test/tbcdb_empty_barrel.html").toString(),
    },
};
