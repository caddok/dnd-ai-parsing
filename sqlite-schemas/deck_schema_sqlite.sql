-- SQLite DDL for Decks (Normalized)

CREATE TABLE IF NOT EXISTS sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS decks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    source_id INTEGER REFERENCES sources(id),
    page INTEGER,
    has_card_art BOOLEAN,
    back_image_type TEXT,
    back_image_path TEXT,
    back_image_width INTEGER,
    back_image_height INTEGER,
    back_image_credit TEXT
);

CREATE TABLE IF NOT EXISTS deck_cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deck_id INTEGER REFERENCES decks(id) ON DELETE CASCADE,
    uid TEXT,
    replacement BOOLEAN,
    count INTEGER
);

CREATE TABLE IF NOT EXISTS deck_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deck_id INTEGER REFERENCES decks(id) ON DELETE CASCADE,
    entry_order INTEGER NOT NULL,
    type TEXT,
    content TEXT,
    list_items TEXT,
    table_caption TEXT,
    table_col_labels TEXT,
    table_col_styles TEXT,
    table_rows TEXT,
    footnotes TEXT,
    raw_json TEXT
);

CREATE TABLE IF NOT EXISTS deck_other_sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    deck_id INTEGER REFERENCES decks(id) ON DELETE CASCADE,
    source_name TEXT,
    page INTEGER
);

