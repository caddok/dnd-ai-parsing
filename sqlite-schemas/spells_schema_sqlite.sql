
-- SQLite DDL for Spells

CREATE TABLE sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE spells (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    source_id INTEGER REFERENCES sources(id),
    page INTEGER,
    level INTEGER NOT NULL,
    school TEXT, -- e.g., 'A' for Abjuration, 'C' for Conjuration
    srd BOOLEAN,
    basic_rules BOOLEAN,
    has_fluff BOOLEAN,
    has_fluff_images BOOLEAN
);

CREATE TABLE spell_casting_time (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    spell_id INTEGER REFERENCES spells(id) ON DELETE CASCADE,
    time_number INTEGER,
    time_unit TEXT,
    condition TEXT
);

CREATE TABLE spell_range (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    spell_id INTEGER REFERENCES spells(id) ON DELETE CASCADE,
    range_type TEXT, -- e.g., 'point', 'self', 'touch', 'sight', 'unlimited'
    distance_amount INTEGER,
    distance_unit TEXT,
    aoe_type TEXT,
    aoe_size INTEGER,
    aoe_unit TEXT
);

CREATE TABLE spell_components (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    spell_id INTEGER REFERENCES spells(id) ON DELETE CASCADE,
    verbal BOOLEAN,
    somatic BOOLEAN,
    material TEXT,
    material_cost INTEGER,
    material_consumed BOOLEAN
);

CREATE TABLE spell_duration (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    spell_id INTEGER REFERENCES spells(id) ON DELETE CASCADE,
    duration_type TEXT, -- e.g., 'timed', 'instant', 'permanent'
    duration_amount INTEGER,
    duration_unit TEXT,
    concentration BOOLEAN,
    up_to BOOLEAN
);

CREATE TABLE spell_damage_inflict (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    spell_id INTEGER REFERENCES spells(id) ON DELETE CASCADE,
    damage_type TEXT
);

CREATE TABLE spell_attack_type (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    spell_id INTEGER REFERENCES spells(id) ON DELETE CASCADE,
    attack_type TEXT
);

CREATE TABLE spell_saving_throw (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    spell_id INTEGER REFERENCES spells(id) ON DELETE CASCADE,
    ability TEXT,
    success_effect TEXT
);

CREATE TABLE spell_condition_inflict (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    spell_id INTEGER REFERENCES spells(id) ON DELETE CASCADE,
    condition_name TEXT
);

CREATE TABLE spell_misc_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    spell_id INTEGER REFERENCES spells(id) ON DELETE CASCADE,
    tag TEXT
);

CREATE TABLE spell_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    spell_id INTEGER REFERENCES spells(id) ON DELETE CASCADE,
    parent_entry_id INTEGER REFERENCES spell_entries(id) ON DELETE CASCADE,
    entry_order INTEGER NOT NULL,
    type TEXT, -- e.g., 'string', 'list', 'entries', 'table', 'inset'
    name TEXT, -- for named entries like "Tools Required"
    content TEXT, -- for simple string entries or cleaned text from complex entries
    list_items TEXT, -- TEXT for list items (JSON string)
    table_caption TEXT,
    table_col_labels TEXT, -- TEXT for column labels (JSON string)
    table_rows TEXT, -- TEXT for table rows (JSON string)
    ability_attributes TEXT, -- TEXT for abilityDc/abilityAttackMod attributes (JSON string)
    ref_feature_name TEXT,
    ref_feature_class TEXT,
    ref_feature_subclass TEXT,
    ref_feature_source TEXT,
    ref_feature_level INTEGER
);
