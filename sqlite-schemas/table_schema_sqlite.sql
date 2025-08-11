-- SQLite DDL for Tables (Normalized)

CREATE TABLE IF NOT EXISTS sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS tables (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    source_id INTEGER REFERENCES sources(id),
    page INTEGER,
    caption TEXT
);

CREATE TABLE IF NOT EXISTS table_column_labels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_id INTEGER REFERENCES tables(id) ON DELETE CASCADE,
    label_order INTEGER NOT NULL,
    label_text TEXT
);

CREATE TABLE IF NOT EXISTS table_column_styles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_id INTEGER REFERENCES tables(id) ON DELETE CASCADE,
    style_order INTEGER NOT NULL,
    style_text TEXT
);

CREATE TABLE IF NOT EXISTS table_rows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_id INTEGER REFERENCES tables(id) ON DELETE CASCADE,
    row_order INTEGER NOT NULL,
    row_data TEXT
);

CREATE TABLE IF NOT EXISTS table_footnotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_id INTEGER REFERENCES tables(id) ON DELETE CASCADE,
    footnote_order INTEGER NOT NULL,
    footnote_text TEXT
);

