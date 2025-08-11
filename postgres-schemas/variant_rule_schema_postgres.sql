CREATE TABLE IF NOT EXISTS variant_rules (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    source_id INTEGER REFERENCES sources(id),
    page INTEGER,
    rule_type VARCHAR(50),
    type_main VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS variant_rule_entries (
    id SERIAL PRIMARY KEY,
    variant_rule_id INTEGER REFERENCES variant_rules(id) ON DELETE CASCADE,
    entry_order INTEGER NOT NULL,
    type VARCHAR(50),
    name VARCHAR(255),
    content TEXT,
    list_items JSONB,
    table_caption TEXT,
    table_col_labels JSONB,
    table_col_styles JSONB,
    table_rows JSONB,
    raw_json JSONB
);

CREATE TABLE IF NOT EXISTS variant_rule_other_sources (
    id SERIAL PRIMARY KEY,
    variant_rule_id INTEGER REFERENCES variant_rules(id) ON DELETE CASCADE,
    source_name VARCHAR(255),
    page INTEGER
);

