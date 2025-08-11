-- SQLite DDL for Feats (Normalized)

CREATE TABLE IF NOT EXISTS sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS feats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    source_id INTEGER REFERENCES sources(id),
    page INTEGER,
    has_fluff BOOLEAN,
    has_fluff_images BOOLEAN
);

CREATE TABLE IF NOT EXISTS feat_prerequisites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,
    prerequisite_json TEXT
);

CREATE TABLE IF NOT EXISTS feat_abilities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,
    ability_score_json TEXT
);

CREATE TABLE IF NOT EXISTS feat_tool_proficiencies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,
    tool_name TEXT,
    value BOOLEAN
);

CREATE TABLE IF NOT EXISTS feat_language_proficiencies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,
    language_name TEXT,
    value BOOLEAN
);

CREATE TABLE IF NOT EXISTS feat_armor_proficiencies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,
    armor_type TEXT,
    value BOOLEAN
);

CREATE TABLE IF NOT EXISTS feat_weapon_proficiencies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,
    weapon_type TEXT,
    value BOOLEAN
);

CREATE TABLE IF NOT EXISTS feat_additional_spells (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,
    spell_data_json TEXT
);

CREATE TABLE IF NOT EXISTS feat_optional_feature_progression (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,
    name TEXT,
    feature_type_json TEXT,
    progression_json TEXT
);

CREATE TABLE IF NOT EXISTS feat_resistances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,
    damage_type TEXT
);

CREATE TABLE IF NOT EXISTS feat_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,
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

