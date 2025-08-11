-- PostgreSQL DDL for Conditions and Diseases (Normalized)

CREATE TABLE IF NOT EXISTS sources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS conditions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    source_id INTEGER REFERENCES sources(id),
    page INTEGER,
    srd BOOLEAN,
    basic_rules BOOLEAN,
    has_fluff_images BOOLEAN
);

CREATE TABLE IF NOT EXISTS diseases (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    source_id INTEGER REFERENCES sources(id),
    page INTEGER
);

CREATE TABLE IF NOT EXISTS condition_entries (
    id SERIAL PRIMARY KEY,
    condition_id INTEGER REFERENCES conditions(id) ON DELETE CASCADE,
    entry_order INTEGER NOT NULL,
    type VARCHAR(50),
    name VARCHAR(255),
    content TEXT,
    list_items JSONB,
    table_caption TEXT,
    table_col_labels JSONB,
    table_rows JSONB
);

CREATE TABLE IF NOT EXISTS disease_entries (
    id SERIAL PRIMARY KEY,
    disease_id INTEGER REFERENCES diseases(id) ON DELETE CASCADE,
    entry_order INTEGER NOT NULL,
    type VARCHAR(50),
    name TEXT,
    content TEXT,
    list_items JSONB,
    table_caption TEXT,
    table_col_labels JSONB,
    table_rows JSONB
);

CREATE TABLE IF NOT EXISTS condition_other_sources (
    id SERIAL PRIMARY KEY,
    condition_id INTEGER REFERENCES conditions(id) ON DELETE CASCADE,
    source_name VARCHAR(255),
    page INTEGER
);

CREATE TABLE IF NOT EXISTS disease_other_sources (
    id SERIAL PRIMARY KEY,
    disease_id INTEGER REFERENCES diseases(id) ON DELETE CASCADE,
    source_name VARCHAR(255),
    page INTEGER
);

