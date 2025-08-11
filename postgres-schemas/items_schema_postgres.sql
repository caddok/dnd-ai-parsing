
-- PostgreSQL DDL for Items

CREATE TABLE sources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    source_id INTEGER REFERENCES sources(id),
    page INTEGER,
    type VARCHAR(50), -- e.g., 'LA', 'W', 'AT'
    rarity VARCHAR(50),
    weight NUMERIC,
    value INTEGER, -- in copper pieces
    attunement BOOLEAN,
    req_attune TEXT, -- specific attunement requirements
    tier VARCHAR(50),
    recharge TEXT,
    charges INTEGER,
    roll_data JSONB, -- for dice rolls associated with the item
    dmg1 TEXT,
    dmg2 TEXT,
    dmg_type VARCHAR(50),
    properties JSONB, -- array of weapon/armor properties
    range TEXT, -- weapon range
    stealth_disadvantage BOOLEAN,
    strength_req INTEGER,
    armor_ac INTEGER,
    armor_dex_mod BOOLEAN,
    weapon_category VARCHAR(50),
    ammo_type VARCHAR(50),
    is_container BOOLEAN,
    is_staff BOOLEAN,
    is_wand BOOLEAN,
    is_rod BOOLEAN,
    is_sentient BOOLEAN,
    is_cursed BOOLEAN,
    is_srd BOOLEAN,
    is_basic_rules BOOLEAN,
    misc_data JSONB -- for any other unstructured data
);

CREATE TABLE item_entries (
    id SERIAL PRIMARY KEY,
    item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
    entry_order INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL, -- e.g., 'string', 'list', 'entries', 'table'
    content TEXT, -- for simple text entries
    data JSONB -- for structured entries like lists, tables, etc.
);
