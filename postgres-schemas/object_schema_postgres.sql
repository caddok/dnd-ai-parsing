CREATE TABLE IF NOT EXISTS objects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    source_id INTEGER REFERENCES sources(id),
    page INTEGER,
    object_type VARCHAR(50),
    ac INTEGER,
    ac_special TEXT,
    hp INTEGER,
    hp_formula VARCHAR(255),
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
    speed_fly_condition VARCHAR(255),
    speed_swim INTEGER,
    has_token BOOLEAN,
    token_credit TEXT,
    has_fluff_images BOOLEAN,
    is_npc BOOLEAN
);

CREATE TABLE IF NOT EXISTS object_sizes (
    id SERIAL PRIMARY KEY,
    object_id INTEGER REFERENCES objects(id) ON DELETE CASCADE,
    size_char CHAR(1)
);

CREATE TABLE IF NOT EXISTS object_immunities (
    id SERIAL PRIMARY KEY,
    object_id INTEGER REFERENCES objects(id) ON DELETE CASCADE,
    damage_type VARCHAR(255),
    special_note TEXT
);

CREATE TABLE IF NOT EXISTS object_resistances (
    id SERIAL PRIMARY KEY,
    object_id INTEGER REFERENCES objects(id) ON DELETE CASCADE,
    damage_type VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS object_vulnerabilities (
    id SERIAL PRIMARY KEY,
    object_id INTEGER REFERENCES objects(id) ON DELETE CASCADE,
    damage_type VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS object_entries (
    id SERIAL PRIMARY KEY,
    object_id INTEGER REFERENCES objects(id) ON DELETE CASCADE,
    entry_order INTEGER NOT NULL,
    type VARCHAR(50),
    name VARCHAR(255),
    content TEXT,
    list_items JSONB,
    table_caption TEXT,
    table_col_labels JSONB,
    table_col_styles JSONB,
    table_rows JSONB,
    image_href_type VARCHAR(50),
    image_href_path TEXT,
    image_title TEXT,
    image_width INTEGER,
    image_height INTEGER,
    raw_json JSONB
);

CREATE TABLE IF NOT EXISTS object_action_entries (
    id SERIAL PRIMARY KEY,
    object_id INTEGER REFERENCES objects(id) ON DELETE CASCADE,
    entry_order INTEGER NOT NULL,
    type VARCHAR(50),
    name VARCHAR(255),
    entries_json JSONB
);

