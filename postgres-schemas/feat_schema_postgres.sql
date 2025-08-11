CREATE TABLE IF NOT EXISTS feats (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    source_id INTEGER REFERENCES sources(id),
    page INTEGER,
    has_fluff BOOLEAN,
    has_fluff_images BOOLEAN
);

CREATE TABLE IF NOT EXISTS feat_prerequisites (
    id SERIAL PRIMARY KEY,
    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,
    prerequisite_json JSONB
);

CREATE TABLE IF NOT EXISTS feat_abilities (
    id SERIAL PRIMARY KEY,
    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,
    ability_score_json JSONB
);

CREATE TABLE IF NOT EXISTS feat_tool_proficiencies (
    id SERIAL PRIMARY KEY,
    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,
    tool_name VARCHAR(255),
    value BOOLEAN
);

CREATE TABLE IF NOT EXISTS feat_language_proficiencies (
    id SERIAL PRIMARY KEY,
    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,
    language_name VARCHAR(255),
    value BOOLEAN
);

CREATE TABLE IF NOT EXISTS feat_armor_proficiencies (
    id SERIAL PRIMARY KEY,
    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,
    armor_type VARCHAR(255),
    value BOOLEAN
);

CREATE TABLE IF NOT EXISTS feat_weapon_proficiencies (
    id SERIAL PRIMARY KEY,
    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,
    weapon_type VARCHAR(255),
    value BOOLEAN
);

CREATE TABLE IF NOT EXISTS feat_additional_spells (
    id SERIAL PRIMARY KEY,
    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,
    spell_data_json JSONB
);

CREATE TABLE IF NOT EXISTS feat_optional_feature_progression (
    id SERIAL PRIMARY KEY,
    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,
    name VARCHAR(255),
    feature_type_json JSONB,
    progression_json JSONB
);

CREATE TABLE IF NOT EXISTS feat_resistances (
    id SERIAL PRIMARY KEY,
    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,
    damage_type VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS feat_entries (
    id SERIAL PRIMARY KEY,
    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,
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

