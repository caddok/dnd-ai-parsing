
CREATE TABLE IF NOT EXISTS sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS languages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS tools (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS backgrounds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    source_id INTEGER,
    page INTEGER,
    srd INTEGER,
    basic_rules INTEGER,
    description TEXT,
    starting_equipment TEXT,
    FOREIGN KEY (source_id) REFERENCES sources(id)
);

CREATE TABLE IF NOT EXISTS background_skill_proficiencies (
    background_id INTEGER,
    skill_id INTEGER,
    is_choice INTEGER DEFAULT 0,
    choose_count INTEGER,
    PRIMARY KEY (background_id, skill_id),
    FOREIGN KEY (background_id) REFERENCES backgrounds(id),
    FOREIGN KEY (skill_id) REFERENCES skills(id)
);

CREATE TABLE IF NOT EXISTS background_language_proficiencies (
    background_id INTEGER,
    language_id INTEGER,
    is_choice INTEGER DEFAULT 0,
    choose_count INTEGER,
    any_standard INTEGER,
    PRIMARY KEY (background_id, language_id),
    FOREIGN KEY (background_id) REFERENCES backgrounds(id),
    FOREIGN KEY (language_id) REFERENCES languages(id)
);

CREATE TABLE IF NOT EXISTS background_tool_proficiencies (
    background_id INTEGER,
    tool_id INTEGER,
    is_choice INTEGER DEFAULT 0,
    choose_count INTEGER,
    PRIMARY KEY (background_id, tool_id),
    FOREIGN KEY (background_id) REFERENCES backgrounds(id),
    FOREIGN KEY (tool_id) REFERENCES tools(id)
);
    