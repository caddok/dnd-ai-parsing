-- PostgreSQL DDL for Tables (Normalized)

CREATE TABLE IF NOT EXISTS sources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS tables (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    source_id INTEGER REFERENCES sources(id),
    page INTEGER,
    caption TEXT
);

CREATE TABLE IF NOT EXISTS table_column_labels (
    id SERIAL PRIMARY KEY,
    table_id INTEGER REFERENCES tables(id) ON DELETE CASCADE,
    label_order INTEGER NOT NULL,
    label_text TEXT
);

CREATE TABLE IF NOT EXISTS table_column_styles (
    id SERIAL PRIMARY KEY,
    table_id INTEGER REFERENCES tables(id) ON DELETE CASCADE,
    style_order INTEGER NOT NULL,
    style_text TEXT
);

CREATE TABLE IF NOT EXISTS table_rows (
    id SERIAL PRIMARY KEY,
    table_id INTEGER REFERENCES tables(id) ON DELETE CASCADE,
    row_order INTEGER NOT NULL,
    row_data JSONB
);

CREATE TABLE IF NOT EXISTS table_footnotes (
    id SERIAL PRIMARY KEY,
    table_id INTEGER REFERENCES tables(id) ON DELETE CASCADE,
    footnote_order INTEGER NOT NULL,
    footnote_text TEXT
);

