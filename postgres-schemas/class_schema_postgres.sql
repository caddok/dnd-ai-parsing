CREATE TABLE IF NOT EXISTS classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    source_id INTEGER REFERENCES sources(id),
    page INTEGER,
    hd_number INTEGER,
    hd_faces INTEGER,
    spellcasting_ability VARCHAR(50),
    caster_progression VARCHAR(255),
    prepared_spells VARCHAR(255),
    prepared_spells_change VARCHAR(255),
    has_fluff BOOLEAN,
    has_fluff_images BOOLEAN
);

CREATE TABLE IF NOT EXISTS class_other_sources (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    source_name VARCHAR(255),
    page INTEGER
);

CREATE TABLE IF NOT EXISTS class_proficiencies (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    proficiency_name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS class_cantrip_progression (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    level INTEGER,
    cantrips_known INTEGER
);

CREATE TABLE IF NOT EXISTS class_optional_feature_progression (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    name VARCHAR(255),
    feature_type JSONB,
    progression JSONB
);

CREATE TABLE IF NOT EXISTS class_starting_proficiencies_armor (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    armor_type VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS class_starting_proficiencies_weapons (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    weapon_type VARCHAR(255),
    optional BOOLEAN
);

CREATE TABLE IF NOT EXISTS class_starting_proficiencies_tools (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    tool_name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS class_starting_proficiencies_tool_proficiencies (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    tool_name VARCHAR(255),
    value BOOLEAN
);

CREATE TABLE IF NOT EXISTS class_starting_proficiencies_skills (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    choose_from JSONB,
    count INTEGER
);

CREATE TABLE IF NOT EXISTS class_starting_equipment_default (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS class_starting_equipment_default_data (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    data_json JSONB
);

CREATE TABLE IF NOT EXISTS class_multiclassing_requirements (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    ability VARCHAR(50),
    score INTEGER
);

CREATE TABLE IF NOT EXISTS class_multiclassing_proficiencies_gained_armor (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    armor_type VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS class_multiclassing_proficiencies_gained_tools (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    tool_name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS class_multiclassing_proficiencies_gained_tool_proficiencies (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    tool_name VARCHAR(255),
    value BOOLEAN
);

CREATE TABLE IF NOT EXISTS class_table_groups (
    id SERIAL PRIMARY KEY,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    title VARCHAR(255),
    col_labels JSONB,
    rows JSONB,
    rows_spell_progression JSONB
);

CREATE TABLE IF NOT EXISTS subclasses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    short_name VARCHAR(255),
    source_id INTEGER REFERENCES sources(id),
    class_name VARCHAR(255),
    class_source VARCHAR(255),
    page INTEGER,
    has_fluff BOOLEAN,
    has_fluff_images BOOLEAN
);

CREATE TABLE IF NOT EXISTS subclass_other_sources (
    id SERIAL PRIMARY KEY,
    subclass_id INTEGER REFERENCES subclasses(id) ON DELETE CASCADE,
    source_name VARCHAR(255),
    page INTEGER
);

CREATE TABLE IF NOT EXISTS subclass_additional_spells (
    id SERIAL PRIMARY KEY,
    subclass_id INTEGER REFERENCES subclasses(id) ON DELETE CASCADE,
    prepared_spells_json JSONB
);

CREATE TABLE IF NOT EXISTS subclass_features (
    id SERIAL PRIMARY KEY,
    subclass_id INTEGER REFERENCES subclasses(id) ON DELETE CASCADE,
    name VARCHAR(255),
    source VARCHAR(255),
    level INTEGER
);

CREATE TABLE IF NOT EXISTS features (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    source_id INTEGER REFERENCES sources(id),
    page INTEGER,
    class_name VARCHAR(255),
    class_source VARCHAR(255),
    subclass_short_name VARCHAR(255),
    subclass_source VARCHAR(255),
    level INTEGER,
    header INTEGER,
    has_fluff BOOLEAN,
    has_fluff_images BOOLEAN
);

CREATE TABLE IF NOT EXISTS feature_entries (
    id SERIAL PRIMARY KEY,
    feature_id INTEGER REFERENCES features(id) ON DELETE CASCADE,
    entry_order INTEGER NOT NULL,
    type VARCHAR(50),
    name VARCHAR(255),
    content TEXT,
    list_items JSONB,
    table_caption TEXT,
    table_col_labels JSONB,
    table_rows JSONB,
    image_href_type VARCHAR(50),
    image_href_path TEXT,
    image_title VARCHAR(255),
    image_width INTEGER,
    image_height INTEGER,
    raw_json JSONB,
    ref_feature_name VARCHAR(255),
    ref_feature_class VARCHAR(255),
    ref_feature_source VARCHAR(255),
    ref_feature_level INTEGER,
    ref_subclass_feature_name VARCHAR(255),
    ref_subclass_feature_class VARCHAR(255),
    ref_subclass_feature_class_source VARCHAR(255),
    ref_subclass_feature_subclass_short_name VARCHAR(255),
    ref_subclass_feature_subclass_source VARCHAR(255),
    ref_subclass_feature_level INTEGER,
    ability_dc_attributes JSONB,
    ability_attack_mod_attributes JSONB
);

CREATE TABLE IF NOT EXISTS feature_other_sources (
    id SERIAL PRIMARY KEY,
    feature_id INTEGER REFERENCES features(id) ON DELETE CASCADE,
    source_name VARCHAR(255),
    page INTEGER
);

