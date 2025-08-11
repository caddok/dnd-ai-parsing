-- SQLite DDL for Deities (Normalized)

CREATE TABLE IF NOT EXISTS sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS deities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    source_id INTEGER REFERENCES sources(id),
    page INTEGER,
    pantheon TEXT,
    title TEXT,
    category TEXT,
    province TEXT,
    symbol TEXT,
    piety BOOLEAN,
    reprint_alias TEXT,
    custom_extension_of TEXT,
    symbol_img_type TEXT,
    symbol_img_path TEXT,
    symbol_img_credit TEXT
);

CREATE TABLE IF NOT EXISTS deity_alt_names (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deity_id INTEGER REFERENCES deities(id) ON DELETE CASCADE,
    alt_name TEXT
);

CREATE TABLE IF NOT EXISTS deity_alignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deity_id INTEGER REFERENCES deities(id) ON DELETE CASCADE,
    alignment_char CHAR(1)
);

CREATE TABLE IF NOT EXISTS deity_domains (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deity_id INTEGER REFERENCES deities(id) ON DELETE CASCADE,
    domain_name TEXT
);

CREATE TABLE IF NOT EXISTS deity_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deity_id INTEGER REFERENCES deities(id) ON DELETE CASCADE,
    entry_order INTEGER NOT NULL,
    type TEXT,
    name TEXT,
    content TEXT,
    list_items TEXT,
    table_caption TEXT,
    table_col_labels TEXT,
    table_col_styles TEXT,
    table_rows TEXT,
    footnotes TEXT,
    image_href_type TEXT,
    image_href_path TEXT,
    image_credit TEXT,
    raw_json TEXT
);

