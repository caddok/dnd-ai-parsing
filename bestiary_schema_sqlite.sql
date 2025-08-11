-- SQLite DDL for Bestiary (Normalized)

CREATE TABLE IF NOT EXISTS sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS monsters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    source_id INTEGER REFERENCES sources(id),
    page INTEGER,
    size TEXT,
    type_main TEXT,
    alignment_main TEXT,
    alignment_prefix TEXT,
    hp_average INTEGER,
    hp_formula TEXT,
    strength INTEGER,
    dexterity INTEGER,
    constitution INTEGER,
    intelligence INTEGER,
    wisdom INTEGER,
    charisma INTEGER,
    passive_perception INTEGER,
    challenge_rating_cr TEXT,
    challenge_rating_coven TEXT,
    has_token BOOLEAN,
    has_fluff BOOLEAN,
    has_fluff_images BOOLEAN,
    dragon_casting_color TEXT,
    dragon_age TEXT,
    is_named_creature BOOLEAN,
    sound_clip_type TEXT,
    sound_clip_path TEXT
);

CREATE TABLE IF NOT EXISTS monster_speeds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    speed_type TEXT NOT NULL,
    speed_value INTEGER NOT NULL,
    condition TEXT,
    can_hover BOOLEAN
);

CREATE TABLE IF NOT EXISTS monster_type_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    tag TEXT
);

CREATE TABLE IF NOT EXISTS monster_ac_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    ac_value INTEGER,
    ac_type TEXT,
    ac_condition TEXT,
    ac_braces BOOLEAN
);

CREATE TABLE IF NOT EXISTS monster_saves (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    ability TEXT,
    modifier TEXT
);

CREATE TABLE IF NOT EXISTS monster_skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    skill_id INTEGER REFERENCES skills(id),
    modifier TEXT,
    other_data TEXT
);

CREATE TABLE IF NOT EXISTS monster_senses_list (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    sense_description TEXT
);

CREATE TABLE IF NOT EXISTS monster_resistances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    damage_type TEXT,
    note TEXT,
    condition BOOLEAN
);

CREATE TABLE IF NOT EXISTS monster_immunities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    damage_type TEXT,
    note TEXT,
    condition BOOLEAN
);

CREATE TABLE IF NOT EXISTS monster_condition_immunities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    condition_name TEXT
);

CREATE TABLE IF NOT EXISTS monster_languages_list (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    language_id INTEGER REFERENCES languages(id),
    choice_count INTEGER
);

CREATE TABLE IF NOT EXISTS monster_spellcasting_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    name TEXT,
    type TEXT,
    ability TEXT,
    header_entries TEXT,
    spells_by_level TEXT,
    will_spells TEXT,
    daily_spells TEXT,
    footer_entries TEXT,
    display_as TEXT
);

CREATE TABLE IF NOT EXISTS monster_traits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    name TEXT,
    entries TEXT
);

CREATE TABLE IF NOT EXISTS monster_actions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    name TEXT,
    entries TEXT
);

CREATE TABLE IF NOT EXISTS monster_reactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    name TEXT,
    entries TEXT
);

CREATE TABLE IF NOT EXISTS monster_legendary_actions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    name TEXT,
    entries TEXT,
    cost INTEGER
);

CREATE TABLE IF NOT EXISTS monster_legendary_group (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    name TEXT,
    source TEXT
);

CREATE TABLE IF NOT EXISTS monster_environments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    environment_name TEXT
);

CREATE TABLE IF NOT EXISTS monster_attached_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    item_name TEXT
);

CREATE TABLE IF NOT EXISTS monster_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    tag_type TEXT,
    tag_name TEXT
);

CREATE TABLE IF NOT EXISTS monster_variants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    type TEXT,
    name TEXT,
    entries TEXT,
    version_name TEXT,
    add_headers_as TEXT
);

CREATE TABLE IF NOT EXISTS monster_other_sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    source_name TEXT,
    page INTEGER
);

CREATE TABLE IF NOT EXISTS monster_reprinted_as (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    reprinted_name TEXT
);

