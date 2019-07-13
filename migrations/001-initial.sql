-- Up
CREATE TABLE guild_configs (
    id TEXT NOT NULL UNIQUE,
    parser TEXT NOT NULL,
    memes INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE queries (
    item_id TEXT NOT NULL,
    server_id TEXT NOT NULL,
    server_name TEXT NOT NULL,
    parser TEXT NOT NULL
);
-- Down
DROP TABLE guild_configs;
DROP TABLE queries;