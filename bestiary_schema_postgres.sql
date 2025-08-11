-- PostgreSQL DDL for Bestiary (Normalized)

CREATE TABLE IF NOT EXISTS sources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS monsters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    source_id INTEGER REFERENCES sources(id),
    page INTEGER,
    size VARCHAR(50),
    type_main VARCHAR(255),
    alignment_main VARCHAR(50),
    alignment_prefix VARCHAR(255),
    hp_average INTEGER,
    hp_formula VARCHAR(255),
    strength INTEGER,
    dexterity INTEGER,
    constitution INTEGER,
    intelligence INTEGER,
    wisdom INTEGER,
    charisma INTEGER,
    passive_perception INTEGER,
    challenge_rating_cr VARCHAR(50),
    challenge_rating_coven VARCHAR(50),
    has_token BOOLEAN,
    has_fluff BOOLEAN,
    has_fluff_images BOOLEAN,
    dragon_casting_color VARCHAR(255),
    dragon_age VARCHAR(255),
    is_named_creature BOOLEAN,
    sound_clip_type VARCHAR(255),
    sound_clip_path VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS monster_speeds (
    id SERIAL PRIMARY KEY,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    speed_type VARCHAR(255) NOT NULL,
    speed_value INTEGER NOT NULL,
    condition TEXT,
    can_hover BOOLEAN
);

CREATE TABLE IF NOT EXISTS monster_type_tags (
    id SERIAL PRIMARY KEY,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    tag VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS monster_ac_entries (
    id SERIAL PRIMARY KEY,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    ac_value INTEGER,
    ac_type VARCHAR(255),
    ac_condition TEXT,
    ac_braces BOOLEAN
);

CREATE TABLE IF NOT EXISTS monster_saves (
    id SERIAL PRIMARY KEY,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    ability VARCHAR(10),
    modifier VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS monster_skills (
    id SERIAL PRIMARY KEY,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    skill_id INTEGER REFERENCES skills(id),
    modifier VARCHAR(10),
    other_data JSONB
);

CREATE TABLE IF NOT EXISTS monster_senses_list (
    id SERIAL PRIMARY KEY,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    sense_description TEXT
);

CREATE TABLE IF NOT EXISTS monster_resistances (
    id SERIAL PRIMARY KEY,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    damage_type VARCHAR(255),
    note TEXT,
    condition BOOLEAN
);

CREATE TABLE IF NOT EXISTS monster_immunities (
    id SERIAL PRIMARY KEY,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    damage_type VARCHAR(255),
    note TEXT,
    condition BOOLEAN
);

CREATE TABLE IF NOT EXISTS monster_condition_immunities (
    id SERIAL PRIMARY KEY,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    condition_name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS monster_languages_list (
    id SERIAL PRIMARY KEY,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    language_id INTEGER REFERENCES languages(id),
    choice_count INTEGER
);

CREATE TABLE IF NOT EXISTS monster_spellcasting_entries (
    id SERIAL PRIMARY KEY,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    name VARCHAR(255),
    type VARCHAR(255),
    ability VARCHAR(10),
    header_entries JSONB,
    spells_by_level JSONB,
    will_spells JSONB,
    daily_spells JSONB,
    footer_entries JSONB,
    display_as VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS monster_traits (
    id SERIAL PRIMARY KEY,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    name VARCHAR(255),
    entries JSONB
);

CREATE TABLE IF NOT EXISTS monster_actions (
    id SERIAL PRIMARY KEY,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    name VARCHAR(255),
    entries JSONB
);

CREATE TABLE IF NOT EXISTS monster_reactions (
    id SERIAL PRIMARY KEY,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    name VARCHAR(255),
    entries JSONB
);

CREATE TABLE IF NOT EXISTS monster_legendary_actions (
    id SERIAL PRIMARY KEY,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    name VARCHAR(255),
    entries JSONB,
    cost INTEGER
);

CREATE TABLE IF NOT EXISTS monster_legendary_group (
    id SERIAL PRIMARY KEY,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    name VARCHAR(255),
    source VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS monster_environments (
    id SERIAL PRIMARY KEY,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    environment_name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS monster_attached_items (
    id SERIAL PRIMARY KEY,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    item_name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS monster_tags (
    id SERIAL PRIMARY KEY,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    tag_type VARCHAR(255),
    tag_name VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS monster_variants (
    id SERIAL PRIMARY KEY,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    type VARCHAR(255),
    name VARCHAR(255),
    entries JSONB,
    version_name VARCHAR(255),
    add_headers_as VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS monster_other_sources (
    id SERIAL PRIMARY KEY,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    source_name VARCHAR(255),
    page INTEGER
);

CREATE TABLE IF NOT EXISTS monster_reprinted_as (
    id SERIAL PRIMARY KEY,
    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,
    reprinted_name VARCHAR(255)
);

