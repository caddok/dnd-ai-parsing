
CREATE TABLE IF NOT EXISTS optional_features (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    source_id INTEGER REFERENCES sources(id),
    page INTEGER,
    srd BOOLEAN,
    basic_rules BOOLEAN,
    is_class_feature_variant BOOLEAN,
    has_fluff_images BOOLEAN
);

CREATE TABLE IF NOT EXISTS optional_feature_types (
    id SERIAL PRIMARY KEY,
    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,
    type_name VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS optional_feature_prerequisites (
    id SERIAL PRIMARY KEY,
    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,
    prerequisite_json JSONB
);

CREATE TABLE IF NOT EXISTS optional_feature_consumes (
    id SERIAL PRIMARY KEY,
    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,
    consume_name VARCHAR(255),
    amount INTEGER
);

CREATE TABLE IF NOT EXISTS optional_feature_additional_spells (
    id SERIAL PRIMARY KEY,
    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,
    spell_data_json JSONB
);

CREATE TABLE IF NOT EXISTS optional_feature_senses (
    id SERIAL PRIMARY KEY,
    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,
    sense_type VARCHAR(255),
    range INTEGER
);

CREATE TABLE IF NOT EXISTS optional_feature_skill_proficiencies (
    id SERIAL PRIMARY KEY,
    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,
    skill_name VARCHAR(255),
    value BOOLEAN
);

CREATE TABLE IF NOT EXISTS optional_feature_resistances (
    id SERIAL PRIMARY KEY,
    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,
    damage_type VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS optional_feature_entries (
    id SERIAL PRIMARY KEY,
    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,
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

CREATE TABLE IF NOT EXISTS optional_feature_other_sources (
    id SERIAL PRIMARY KEY,
    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,
    source_name VARCHAR(255),
    page INTEGER
);

