-- SQLite DDL for Variant Rules (Normalized)

CREATE TABLE IF NOT EXISTS sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS variant_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    source_id INTEGER REFERENCES sources(id),
    page INTEGER,
    rule_type TEXT,
    type_main TEXT
);

CREATE TABLE IF NOT EXISTS variant_rule_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    variant_rule_id INTEGER REFERENCES variant_rules(id) ON DELETE CASCADE,
    entry_order INTEGER NOT NULL,
    type TEXT,
    name TEXT,
    content TEXT,
    list_items TEXT,
    table_caption TEXT,
    table_col_labels TEXT,
    table_col_styles TEXT,
    table_rows TEXT,
    raw_json TEXT
);

CREATE TABLE IF NOT EXISTS variant_rule_other_sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    variant_rule_id INTEGER REFERENCES variant_rules(id) ON DELETE CASCADE,
    source_name TEXT,
    page INTEGER
);

