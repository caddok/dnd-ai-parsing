-- SQLite DDL for Optional Features (Normalized)

CREATE TABLE IF NOT EXISTS sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS optional_features (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    source_id INTEGER REFERENCES sources(id),
    page INTEGER,
    srd BOOLEAN,
    basic_rules BOOLEAN,
    is_class_feature_variant BOOLEAN,
    has_fluff_images BOOLEAN
);

CREATE TABLE IF NOT EXISTS optional_feature_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,
    type_name TEXT
);

CREATE TABLE IF NOT EXISTS optional_feature_prerequisites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,
    prerequisite_json TEXT
);

CREATE TABLE IF NOT EXISTS optional_feature_consumes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,
    consume_name TEXT,
    amount INTEGER
);

CREATE TABLE IF NOT EXISTS optional_feature_additional_spells (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,
    spell_data_json TEXT
);

CREATE TABLE IF NOT EXISTS optional_feature_senses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,
    sense_type TEXT,
    range INTEGER
);

CREATE TABLE IF NOT EXISTS optional_feature_skill_proficiencies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,
    skill_name TEXT,
    value BOOLEAN
);

CREATE TABLE IF NOT EXISTS optional_feature_resistances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,
    damage_type TEXT
);

CREATE TABLE IF NOT EXISTS optional_feature_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,
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

CREATE TABLE IF NOT EXISTS optional_feature_other_sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,
    source_name TEXT,
    page INTEGER
);

