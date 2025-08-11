-- PostgreSQL DDL for Books (Normalized)

CREATE TABLE IF NOT EXISTS sources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    source_id INTEGER REFERENCES sources(id)
);

CREATE TABLE IF NOT EXISTS book_sections (
    id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    name VARCHAR(255),
    page INTEGER,
    type VARCHAR(50),
    data JSONB
);

CREATE TABLE IF NOT EXISTS book_entries (
    id SERIAL PRIMARY KEY,
    section_id INTEGER REFERENCES book_sections(id) ON DELETE CASCADE,
    entry_order INTEGER NOT NULL,
    type VARCHAR(50),
    name VARCHAR(255),
    content TEXT,
    list_items JSONB,
    table_caption TEXT,
    table_col_labels JSONB,
    table_rows JSONB,
    image_href_type VARCHAR(50),
    image_href_path TEXT,
    image_title VARCHAR(255),
    image_width INTEGER,
    image_height INTEGER,
    raw_json JSONB
);

CREATE TABLE IF NOT EXISTS book_other_sources (
    id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    source_name VARCHAR(255),
    page INTEGER
);

