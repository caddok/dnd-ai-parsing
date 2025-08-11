
CREATE TABLE IF NOT EXISTS language_scripts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS languages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    source_id INTEGER,
    page INTEGER,
    type TEXT,
    typical_speakers TEXT,
    script_id INTEGER,
    description TEXT,
    FOREIGN KEY (source_id) REFERENCES sources(id),
    FOREIGN KEY (script_id) REFERENCES language_scripts(id)
);
    