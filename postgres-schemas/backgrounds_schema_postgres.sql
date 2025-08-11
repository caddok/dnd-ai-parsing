
CREATE TABLE IF NOT EXISTS sources (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS languages (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS tools (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS backgrounds (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    source_id INTEGER REFERENCES sources(id),
    page INTEGER,
    srd BOOLEAN,
    basic_rules BOOLEAN,
    description TEXT,
    starting_equipment JSONB
);

CREATE TABLE IF NOT EXISTS background_skill_proficiencies (
    background_id INTEGER REFERENCES backgrounds(id),
    skill_id INTEGER REFERENCES skills(id),
    is_choice BOOLEAN DEFAULT FALSE,
    choose_count INTEGER,
    PRIMARY KEY (background_id, skill_id)
);

CREATE TABLE IF NOT EXISTS background_language_proficiencies (
    background_id INTEGER REFERENCES backgrounds(id),
    language_id INTEGER REFERENCES languages(id),
    is_choice BOOLEAN DEFAULT FALSE,
    choose_count INTEGER,
    any_standard INTEGER,
    PRIMARY KEY (background_id, language_id)
);

CREATE TABLE IF NOT EXISTS background_tool_proficiencies (
    background_id INTEGER REFERENCES backgrounds(id),
    tool_id INTEGER REFERENCES tools(id),
    is_choice BOOLEAN DEFAULT FALSE,
    choose_count INTEGER,
    PRIMARY KEY (background_id, tool_id)
);
    