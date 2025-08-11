
-- SQLite DDL for Items

CREATE TABLE sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    source_id INTEGER REFERENCES sources(id),
    page INTEGER,
    type TEXT, -- e.g., 'LA', 'W', 'AT'
    rarity TEXT,
    weight REAL,
    value INTEGER, -- in copper pieces
    attunement BOOLEAN,
    req_attune TEXT, -- specific attunement requirements
    tier TEXT,
    recharge TEXT,
    charges INTEGER,
    roll_data TEXT, -- Stored as JSON string
    dmg1 TEXT,
    dmg2 TEXT,
    dmg_type TEXT,
    properties TEXT, -- Stored as JSON string
    range TEXT, -- weapon range
    stealth_disadvantage BOOLEAN,
    strength_req INTEGER,
    armor_ac INTEGER,
    armor_dex_mod BOOLEAN,
    weapon_category TEXT,
    ammo_type TEXT,
    is_container BOOLEAN,
    is_staff BOOLEAN,
    is_wand BOOLEAN,
    is_rod BOOLEAN,
    is_sentient BOOLEAN,
    is_cursed BOOLEAN,
    is_srd BOOLEAN,
    is_basic_rules BOOLEAN,
    misc_data TEXT -- Stored as JSON string
);

CREATE TABLE item_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
    entry_order INTEGER NOT NULL,
    type TEXT, -- e.g., 'string', 'list', 'entries', 'table'
    content TEXT, -- for simple text entries
    data TEXT -- Stored as JSON string for structured entries
);
