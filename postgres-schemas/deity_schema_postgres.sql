CREATE TABLE IF NOT EXISTS deities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    source_id INTEGER REFERENCES sources(id),
    page INTEGER,
    pantheon VARCHAR(255),
    title VARCHAR(255),
    category VARCHAR(255),
    province TEXT,
    symbol TEXT,
    piety BOOLEAN,
    reprint_alias VARCHAR(255),
    custom_extension_of TEXT,
    symbol_img_type VARCHAR(50),
    symbol_img_path TEXT,
    symbol_img_credit TEXT
);

CREATE TABLE IF NOT EXISTS deity_alt_names (
    id SERIAL PRIMARY KEY,
    deity_id INTEGER REFERENCES deities(id) ON DELETE CASCADE,
    alt_name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS deity_alignments (
    id SERIAL PRIMARY KEY,
    deity_id INTEGER REFERENCES deities(id) ON DELETE CASCADE,
    alignment_char CHAR(1)
);

CREATE TABLE IF NOT EXISTS deity_domains (
    id SERIAL PRIMARY KEY,
    deity_id INTEGER REFERENCES deities(id) ON DELETE CASCADE,
    domain_name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS deity_entries (
    id SERIAL PRIMARY KEY,
    deity_id INTEGER REFERENCES deities(id) ON DELETE CASCADE,
    entry_order INTEGER NOT NULL,
    type VARCHAR(50),
    name TEXT,
    content TEXT,
    list_items JSONB,
    table_caption TEXT,
    table_col_labels JSONB,
    table_col_styles JSONB,
    table_rows JSONB,
    footnotes JSONB,
    image_href_type VARCHAR(50),
    image_href_path TEXT,
    image_credit TEXT,
    raw_json JSONB
);

