-- SQLite DDL for Conditions and Diseases (Normalized)

CREATE TABLE IF NOT EXISTS sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS conditions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    source_id INTEGER REFERENCES sources(id),
    page INTEGER,
    srd BOOLEAN,
    basic_rules BOOLEAN,
    has_fluff_images BOOLEAN
);

CREATE TABLE IF NOT EXISTS diseases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    source_id INTEGER REFERENCES sources(id),
    page INTEGER
);

CREATE TABLE IF NOT EXISTS condition_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    condition_id INTEGER REFERENCES conditions(id) ON DELETE CASCADE,
    entry_order INTEGER NOT NULL,
    type TEXT,
    content TEXT,
    list_items TEXT,
    table_caption TEXT,
    table_col_labels TEXT,
    table_rows TEXT
);

CREATE TABLE IF NOT EXISTS disease_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    disease_id INTEGER REFERENCES diseases(id) ON DELETE CASCADE,
    entry_order INTEGER NOT NULL,
    type TEXT,
    name TEXT,
    content TEXT,
    list_items TEXT,
    table_caption TEXT,
    table_col_labels TEXT,
    table_rows TEXT
);

CREATE TABLE IF NOT EXISTS condition_other_sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    condition_id INTEGER REFERENCES conditions(id) ON DELETE CASCADE,
    source_name TEXT,
    page INTEGER
);

CREATE TABLE IF NOT EXISTS disease_other_sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    disease_id INTEGER REFERENCES diseases(id) ON DELETE CASCADE,
    source_name TEXT,
    page INTEGER
);

