
CREATE TABLE IF NOT EXISTS language_scripts (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS languages (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    source_id INTEGER REFERENCES sources(id),
    page INTEGER,
    type TEXT,
    typical_speakers TEXT[],
    script_id INTEGER REFERENCES language_scripts(id),
    description TEXT
);
    