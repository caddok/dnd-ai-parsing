-- SQLite DDL for Objects (Normalized)

CREATE TABLE IF NOT EXISTS sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS objects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    source_id INTEGER REFERENCES sources(id),
    page INTEGER,
    object_type TEXT,
    ac INTEGER,
    ac_special TEXT,
    hp INTEGER,
    hp_formula TEXT,
    hp_special TEXT,
    strength INTEGER,
    dexterity INTEGER,
    constitution INTEGER,
    intelligence INTEGER,
    wisdom INTEGER,
    charisma INTEGER,
    speed_walk INTEGER,
    speed_burrow INTEGER,
    speed_climb INTEGER,
    speed_fly INTEGER,
    speed_fly_condition TEXT,
    speed_swim INTEGER,
    has_token BOOLEAN,
    token_credit TEXT,
    has_fluff_images BOOLEAN,
    is_npc BOOLEAN
);

CREATE TABLE IF NOT EXISTS object_sizes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    object_id INTEGER REFERENCES objects(id) ON DELETE CASCADE,
    size_char CHAR(1)
);

CREATE TABLE IF NOT EXISTS object_immunities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    object_id INTEGER REFERENCES objects(id) ON DELETE CASCADE,
    damage_type TEXT,
    special_note TEXT
);

CREATE TABLE IF NOT EXISTS object_resistances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    object_id INTEGER REFERENCES objects(id) ON DELETE CASCADE,
    damage_type TEXT
);

CREATE TABLE IF NOT EXISTS object_vulnerabilities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    object_id INTEGER REFERENCES objects(id) ON DELETE CASCADE,
    damage_type TEXT
);

CREATE TABLE IF NOT EXISTS object_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    object_id INTEGER REFERENCES objects(id) ON DELETE CASCADE,
    entry_order INTEGER NOT NULL,
    type TEXT,
    name TEXT,
    content TEXT,
    list_items TEXT,
    table_caption TEXT,
    table_col_labels TEXT,
    table_col_styles TEXT,
    table_rows TEXT,
    image_href_type TEXT,
    image_href_path TEXT,
    image_title TEXT,
    image_width INTEGER,
    image_height INTEGER,
    raw_json TEXT
);

CREATE TABLE IF NOT EXISTS object_action_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    object_id INTEGER REFERENCES objects(id) ON DELETE CASCADE,
    entry_order INTEGER NOT NULL,
    type TEXT,
    name TEXT,
    entries_json TEXT
);

