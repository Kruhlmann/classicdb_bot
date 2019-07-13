-- Up
ALTER TABLE queries RENAME TO tmp;
CREATE TABLE queries (
    item_id TEXT NOT NULL,
    server_id TEXT NOT NULL,
    parser TEXT NOT NULL,
    hits INTEGER
);
INSERT INTO queries
    SELECT
        item_id, server_id, parser, 0
    FROM
        tmp;
DROP TABLE tmp;
-- Down
ALTER TABLE queries RENAME TO tmp;
CREATE TABLE queries (
    item_id TEXT NOT NULL,
    server_id TEXT NOT NULL,
    server_name TEXT NOT NULL,
    parser TEXT NOT NULL
);
INSERT INTO queries
    SELECT
        item_id, server_id, '', parser
    FROM
        tmp;
DROP TABLE tmp;