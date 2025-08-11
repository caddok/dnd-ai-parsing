CREATE TABLE spells (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    source_id INTEGER REFERENCES sources(id),
    page INTEGER,
    level INTEGER NOT NULL,
    school CHAR(1), -- e.g., 'A' for Abjuration, 'C' for Conjuration
    srd BOOLEAN,
    basic_rules BOOLEAN,
    has_fluff BOOLEAN,
    has_fluff_images BOOLEAN
);

CREATE TABLE spell_casting_time (
    id SERIAL PRIMARY KEY,
    spell_id INTEGER REFERENCES spells(id) ON DELETE CASCADE,
    time_number INTEGER,
    time_unit VARCHAR(50),
    condition TEXT
);

CREATE TABLE spell_range (
    id SERIAL PRIMARY KEY,
    spell_id INTEGER REFERENCES spells(id) ON DELETE CASCADE,
    range_type VARCHAR(50), -- e.g., 'point', 'self', 'touch', 'sight', 'unlimited'
    distance_amount INTEGER,
    distance_unit VARCHAR(50),
    aoe_type VARCHAR(50),
    aoe_size INTEGER,
    aoe_unit VARCHAR(50)
);

CREATE TABLE spell_components (
    id SERIAL PRIMARY KEY,
    spell_id INTEGER REFERENCES spells(id) ON DELETE CASCADE,
    verbal BOOLEAN,
    somatic BOOLEAN,
    material TEXT,
    material_cost INTEGER,
    material_consumed BOOLEAN
);

CREATE TABLE spell_duration (
    id SERIAL PRIMARY KEY,
    spell_id INTEGER REFERENCES spells(id) ON DELETE CASCADE,
    duration_type VARCHAR(50), -- e.g., 'timed', 'instant', 'permanent'
    duration_amount INTEGER,
    duration_unit VARCHAR(50),
    concentration BOOLEAN,
    up_to BOOLEAN
);

CREATE TABLE spell_damage_inflict (
    id SERIAL PRIMARY KEY,
    spell_id INTEGER REFERENCES spells(id) ON DELETE CASCADE,
    damage_type VARCHAR(50)
);

CREATE TABLE spell_attack_type (
    id SERIAL PRIMARY KEY,
    spell_id INTEGER REFERENCES spells(id) ON DELETE CASCADE,
    attack_type VARCHAR(50)
);

CREATE TABLE spell_saving_throw (
    id SERIAL PRIMARY KEY,
    spell_id INTEGER REFERENCES spells(id) ON DELETE CASCADE,
    ability VARCHAR(3),
    success_effect TEXT
);

CREATE TABLE spell_condition_inflict (
    id SERIAL PRIMARY KEY,
    spell_id INTEGER REFERENCES spells(id) ON DELETE CASCADE,
    condition_name VARCHAR(255)
);

CREATE TABLE spell_misc_tags (
    id SERIAL PRIMARY KEY,
    spell_id INTEGER REFERENCES spells(id) ON DELETE CASCADE,
    tag VARCHAR(50)
);

CREATE TABLE spell_entries (
    id SERIAL PRIMARY KEY,
    spell_id INTEGER REFERENCES spells(id) ON DELETE CASCADE,
    parent_entry_id INTEGER REFERENCES spell_entries(id) ON DELETE CASCADE,
    entry_order INTEGER NOT NULL,
    type VARCHAR(50), -- e.g., 'string', 'list', 'entries', 'table', 'inset'
    name TEXT, -- for named entries like "Tools Required"
    content TEXT, -- for simple string entries or cleaned text from complex entries
    list_items JSONB, -- JSONB for list items
    table_caption TEXT,
    table_col_labels JSONB, -- JSONB for column labels
    table_rows JSONB, -- JSONB for table rows
    ability_attributes JSONB, -- JSONB for abilityDc/abilityAttackMod attributes
    ref_feature_name TEXT,
    ref_feature_class TEXT,
    ref_feature_subclass TEXT,
    ref_feature_source TEXT,
    ref_feature_level INTEGER
);
