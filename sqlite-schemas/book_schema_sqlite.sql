-- SQLite DDL for Books (Normalized)

CREATE TABLE IF NOT EXISTS sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    source_id INTEGER REFERENCES sources(id)
);

CREATE TABLE IF NOT EXISTS book_sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    name TEXT,
    page INTEGER,
    type TEXT,
    data TEXT
);

CREATE TABLE IF NOT EXISTS book_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    section_id INTEGER REFERENCES book_sections(id) ON DELETE CASCADE,
    entry_order INTEGER NOT NULL,
    type TEXT,
    name TEXT,
    content TEXT,
    list_items TEXT,
    table_caption TEXT,
    table_col_labels TEXT,
    table_rows TEXT,
    image_href_type TEXT,
    image_href_path TEXT,
    image_title TEXT,
    image_width INTEGER,
    image_height INTEGER,
    raw_json TEXT
);

CREATE TABLE IF NOT EXISTS book_other_sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    source_name TEXT,
    page INTEGER
);

