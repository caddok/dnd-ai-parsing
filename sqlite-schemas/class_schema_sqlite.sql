-- SQLite DDL for Classes (Normalized)

CREATE TABLE IF NOT EXISTS sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    source_id INTEGER REFERENCES sources(id),
    page INTEGER,
    hd_number INTEGER,
    hd_faces INTEGER,
    spellcasting_ability TEXT,
    caster_progression TEXT,
    prepared_spells TEXT,
    prepared_spells_change TEXT,
    has_fluff BOOLEAN,
    has_fluff_images BOOLEAN
);

CREATE TABLE IF NOT EXISTS class_other_sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    source_name TEXT,
    page INTEGER
);

CREATE TABLE IF NOT EXISTS class_proficiencies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    proficiency_name TEXT
);

CREATE TABLE IF NOT EXISTS class_cantrip_progression (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    level INTEGER,
    cantrips_known INTEGER
);

CREATE TABLE IF NOT EXISTS class_optional_feature_progression (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    name TEXT,
    feature_type TEXT,
    progression TEXT
);

CREATE TABLE IF NOT EXISTS class_starting_proficiencies_armor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    armor_type TEXT
);

CREATE TABLE IF NOT EXISTS class_starting_proficiencies_weapons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    weapon_type TEXT,
    optional BOOLEAN
);

CREATE TABLE IF NOT EXISTS class_starting_proficiencies_tools (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    tool_name TEXT
);

CREATE TABLE IF NOT EXISTS class_starting_proficiencies_tool_proficiencies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    tool_name TEXT,
    value BOOLEAN
);

CREATE TABLE IF NOT EXISTS class_starting_proficiencies_skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    choose_from TEXT,
    count INTEGER
);

CREATE TABLE IF NOT EXISTS class_starting_equipment_default (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS class_starting_equipment_default_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    data_json TEXT
);

CREATE TABLE IF NOT EXISTS class_multiclassing_requirements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    ability TEXT,
    score INTEGER
);

CREATE TABLE IF NOT EXISTS class_multiclassing_proficiencies_gained_armor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    armor_type TEXT
);

CREATE TABLE IF NOT EXISTS class_multiclassing_proficiencies_gained_tools (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    tool_name TEXT
);

CREATE TABLE IF NOT EXISTS class_multiclassing_proficiencies_gained_tool_proficiencies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    tool_name TEXT,
    value BOOLEAN
);

CREATE TABLE IF NOT EXISTS class_table_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    title TEXT,
    col_labels TEXT,
    rows TEXT,
    rows_spell_progression TEXT
);

CREATE TABLE IF NOT EXISTS subclasses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    short_name TEXT,
    source_id INTEGER REFERENCES sources(id),
    class_name TEXT,
    class_source TEXT,
    page INTEGER,
    has_fluff BOOLEAN,
    has_fluff_images BOOLEAN
);

CREATE TABLE IF NOT EXISTS subclass_other_sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subclass_id INTEGER REFERENCES subclasses(id) ON DELETE CASCADE,
    source_name TEXT,
    page INTEGER
);

CREATE TABLE IF NOT EXISTS subclass_additional_spells (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subclass_id INTEGER REFERENCES subclasses(id) ON DELETE CASCADE,
    prepared_spells_json TEXT
);

CREATE TABLE IF NOT EXISTS subclass_features (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subclass_id INTEGER REFERENCES subclasses(id) ON DELETE CASCADE,
    name TEXT,
    source TEXT,
    level INTEGER
);

CREATE TABLE IF NOT EXISTS features (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    source_id INTEGER REFERENCES sources(id),
    page INTEGER,
    class_name TEXT,
    class_source TEXT,
    subclass_short_name TEXT,
    subclass_source TEXT,
    level INTEGER,
    header INTEGER,
    has_fluff BOOLEAN,
    has_fluff_images BOOLEAN
);

CREATE TABLE IF NOT EXISTS feature_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    feature_id INTEGER REFERENCES features(id) ON DELETE CASCADE,
    entry_order INTEGER NOT NULL,
    type TEXT,
    name TEXT,
    content TEXT,
    list_items TEXT,
    table_caption TEXT,
    table_col_labels TEXT,
    table_rows TEXT,
    image_href_type TEXT,
    image_href_path TEXT,
    image_title TEXT,
    image_width INTEGER,
    image_height INTEGER,
    raw_json TEXT,
    ref_feature_name TEXT,
    ref_feature_class TEXT,
    ref_feature_source TEXT,
    ref_feature_level INTEGER,
    ref_subclass_feature_name TEXT,
    ref_subclass_feature_class TEXT,
    ref_subclass_feature_class_source TEXT,
    ref_subclass_feature_subclass_short_name TEXT,
    ref_subclass_feature_subclass_source TEXT,
    ref_subclass_feature_level INTEGER,
    ability_dc_attributes TEXT,
    ability_attack_mod_attributes TEXT
);

CREATE TABLE IF NOT EXISTS feature_other_sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    feature_id INTEGER REFERENCES features(id) ON DELETE CASCADE,
    source_name TEXT,
    page INTEGER
);

