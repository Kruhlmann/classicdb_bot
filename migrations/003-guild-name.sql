-- Up
ALTER TABLE guild_configs ADD COLUMN name TEXT;
-- Down
ALTER TABLE guild_configs RENAME TO tmp;
CREATE TABLE guild_configs (
    id TEXT NOT NULL UNIQUE,
    parser TEXT NOT NULL,
    memes INTEGER NOT NULL DEFAULT 0,
    icon TEXT
);
INSERT INTO guild_configs
    SELECT
        id, parser, memes, icon
    FROM
        tmp;
DROP TABLE tmp;