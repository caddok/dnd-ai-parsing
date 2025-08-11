
CREATE TABLE IF NOT EXISTS damage_types (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS conditions (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS races (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    source_id INTEGER REFERENCES sources(id),
    page INTEGER,
    size TEXT[],
    speed_walk INTEGER,
    speed_fly INTEGER,
    speed_swim INTEGER,
    age_mature INTEGER,
    age_max INTEGER,
    darkvision INTEGER,
    description TEXT,
    creature_types TEXT[],
    creature_type_tags TEXT[],
    lineage TEXT
);

CREATE TABLE IF NOT EXISTS race_ability_scores (
    race_id INTEGER REFERENCES races(id),
    ability TEXT NOT NULL,
    bonus INTEGER NOT NULL,
    is_choice BOOLEAN DEFAULT FALSE,
    choose_count INTEGER,
    PRIMARY KEY (race_id, ability)
);

CREATE TABLE IF NOT EXISTS race_resistances (
    race_id INTEGER REFERENCES races(id),
    damage_type_id INTEGER REFERENCES damage_types(id),
    PRIMARY KEY (race_id, damage_type_id)
);

CREATE TABLE IF NOT EXISTS race_condition_immunities (
    race_id INTEGER REFERENCES races(id),
    condition_id INTEGER REFERENCES conditions(id),
    PRIMARY KEY (race_id, condition_id)
);

CREATE TABLE IF NOT EXISTS race_language_proficiencies (
    race_id INTEGER REFERENCES races(id),
    language_id INTEGER REFERENCES languages(id),
    is_choice BOOLEAN DEFAULT FALSE,
    any_standard INTEGER,
    PRIMARY KEY (race_id, language_id)
);

CREATE TABLE IF NOT EXISTS race_skill_proficiencies (
    race_id INTEGER REFERENCES races(id),
    skill_id INTEGER REFERENCES skills(id),
    is_choice BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (race_id, skill_id)
);

CREATE TABLE IF NOT EXISTS race_traits (
    id SERIAL PRIMARY KEY,
    race_id INTEGER REFERENCES races(id),
    name TEXT NOT NULL,
    description TEXT
);
    