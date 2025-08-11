
CREATE TABLE IF NOT EXISTS damage_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS conditions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS races (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    source_id INTEGER,
    page INTEGER,
    size TEXT,
    speed_walk INTEGER,
    speed_fly INTEGER,
    speed_swim INTEGER,
    age_mature INTEGER,
    age_max INTEGER,
    darkvision INTEGER,
    description TEXT,
    creature_types TEXT,
    creature_type_tags TEXT,
    lineage TEXT,
    FOREIGN KEY (source_id) REFERENCES sources(id)
);

CREATE TABLE IF NOT EXISTS race_ability_scores (
    race_id INTEGER,
    ability TEXT NOT NULL,
    bonus INTEGER NOT NULL,
    is_choice INTEGER DEFAULT 0,
    choose_count INTEGER,
    PRIMARY KEY (race_id, ability),
    FOREIGN KEY (race_id) REFERENCES races(id)
);

CREATE TABLE IF NOT EXISTS race_resistances (
    race_id INTEGER,
    damage_type_id INTEGER,
    PRIMARY KEY (race_id, damage_type_id),
    FOREIGN KEY (race_id) REFERENCES races(id),
    FOREIGN KEY (damage_type_id) REFERENCES damage_types(id)
);

CREATE TABLE IF NOT EXISTS race_condition_immunities (
    race_id INTEGER,
    condition_id INTEGER,
    PRIMARY KEY (race_id, condition_id),
    FOREIGN KEY (race_id) REFERENCES races(id),
    FOREIGN KEY (condition_id) REFERENCES conditions(id)
);

CREATE TABLE IF NOT EXISTS race_language_proficiencies (
    race_id INTEGER,
    language_id INTEGER,
    is_choice INTEGER DEFAULT 0,
    any_standard INTEGER,
    PRIMARY KEY (race_id, language_id),
    FOREIGN KEY (race_id) REFERENCES races(id),
    FOREIGN KEY (language_id) REFERENCES languages(id)
);

CREATE TABLE IF NOT EXISTS race_skill_proficiencies (
    race_id INTEGER,
    skill_id INTEGER,
    is_choice INTEGER DEFAULT 0,
    PRIMARY KEY (race_id, skill_id),
    FOREIGN KEY (race_id) REFERENCES races(id),
    FOREIGN KEY (skill_id) REFERENCES skills(id)
);

CREATE TABLE IF NOT EXISTS race_traits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    race_id INTEGER,
    name TEXT NOT NULL,
    description TEXT,
    FOREIGN KEY (race_id) REFERENCES races(id)
);
    