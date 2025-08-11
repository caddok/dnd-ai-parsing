const fs = require('fs').promises;
const path = require('path');

// Helper function to safely escape strings for SQL
function escapeSql(str) {
    if (str === null || typeof str === 'undefined') {
        return 'NULL';
    }
    if (typeof str === 'boolean') {
        return str ? 'TRUE' : 'FALSE';
    }
    if (typeof str !== 'string') {
        return str;
    }
    // For strings, escape single quotes
    return `'${str.replace(/'/g, "''")}'`;
}

// Helper to process entries into a single text block
function processEntries(entries) {
    let text = '';
    if (!entries) return null;

    entries.forEach(entry => {
        if (typeof entry === 'string') {
            text += entry + '\n';
        } else if (typeof entry === 'object' && entry !== null) {
            if (entry.name) {
                text += `**${entry.name}**\n`;
            }
            if (entry.entry) {
                text += entry.entry + '\n';
            }
            if (entry.entries) {
                text += processEntries(entry.entries) + '\n';
            }
            if (entry.items) {
                entry.items.forEach(item => {
                    if (item.name) text += `*${item.name}* `;
                    if (item.entry) text += item.entry + '\n';
                });
            }
            if (entry.type === 'table') {
                text += `| ${entry.colLabels.join(' | ')} |\n`;
                text += `|${entry.colLabels.map(() => '---').join('|')}|\n`;
                entry.rows.forEach(row => {
                    text += `| ${row.join(' | ')} |\n`;
                });
            }
        }
    });
    return text.trim().replace(/{@.*? /g, '').replace(/}/g, '');
}


async function generateBackgrounds() {
    const backgroundsData = JSON.parse(await fs.readFile(path.join('C:', 'Projects', 'dnd-class-data', 'raw-data', 'backgrounds.json'), 'utf8'));
    const backgrounds = backgroundsData.background;

    // --- PostgreSQL Schema for Backgrounds ---
    const postgresSchema = `
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
    `;

    // --- SQLite Schema for Backgrounds ---
    const sqliteSchema = `
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
    `;

    await fs.writeFile('backgrounds_schema_postgres.sql', postgresSchema);
    await fs.writeFile('backgrounds_schema_sqlite.sql', sqliteSchema);

    // --- Generate Inserts ---
    let postgresInserts = '';
    let sqliteInserts = '';

    const allSources = new Set(backgrounds.map(b => b.source));
    const allSkills = new Set();
    const allLanguages = new Set();
    const allTools = new Set();

    backgrounds.forEach(bg => {
        if (bg.skillProficiencies) {
            bg.skillProficiencies.forEach(p => {
                Object.keys(p).forEach(key => {
                    if (key === 'choose') {
                        p.choose.from.forEach(s => allSkills.add(s));
                    } else {
                        allSkills.add(key);
                    }
                });
            });
        }
        if (bg.languageProficiencies) {
            bg.languageProficiencies.forEach(p => {
                 Object.keys(p).forEach(key => {
                    if (key === 'choose') {
                        p.choose.from.forEach(l => allLanguages.add(l));
                    } else if (key !== 'anyStandard') {
                        allLanguages.add(key);
                    }
                });
            });
        }
        if (bg.toolProficiencies) {
            bg.toolProficiencies.forEach(p => {
                 Object.keys(p).forEach(key => {
                    if (key === 'choose') {
                        p.choose.from.forEach(t => allTools.add(t));
                    } else {
                        allTools.add(key);
                    }
                });
            });
        }
    });
    
    // Add a placeholder for choice records
    allLanguages.add('any');


    postgresInserts += [...allSources].map(s => `INSERT INTO sources (name) VALUES (${escapeSql(s)}) ON CONFLICT (name) DO NOTHING;`).join('\n') + '\n';
    sqliteInserts += [...allSources].map(s => `INSERT OR IGNORE INTO sources (name) VALUES (${escapeSql(s)});`).join('\n') + '\n';
    postgresInserts += [...allSkills].map(s => `INSERT INTO skills (name) VALUES (${escapeSql(s)}) ON CONFLICT (name) DO NOTHING;`).join('\n') + '\n';
    sqliteInserts += [...allSkills].map(s => `INSERT OR IGNORE INTO skills (name) VALUES (${escapeSql(s)});`).join('\n') + '\n';
    postgresInserts += [...allLanguages].map(l => `INSERT INTO languages (name) VALUES (${escapeSql(l)}) ON CONFLICT (name) DO NOTHING;`).join('\n') + '\n';
    sqliteInserts += [...allLanguages].map(l => `INSERT OR IGNORE INTO languages (name) VALUES (${escapeSql(l)});`).join('\n') + '\n';
    postgresInserts += [...allTools].map(t => `INSERT INTO tools (name) VALUES (${escapeSql(t)}) ON CONFLICT (name) DO NOTHING;`).join('\n') + '\n';
    sqliteInserts += [...allTools].map(t => `INSERT OR IGNORE INTO tools (name) VALUES (${escapeSql(t)});`).join('\n') + '\n';


    for (const bg of backgrounds) {
        if (bg._copy) continue; // Skip copies for now

        const description = processEntries(bg.entries);
        const startingEquipment = bg.startingEquipment ? JSON.stringify(bg.startingEquipment) : null;

        // Backgrounds table
        postgresInserts += `
DO $$
DECLARE
    source_id_var INTEGER;
    background_id_var INTEGER;
BEGIN
    SELECT id INTO source_id_var FROM sources WHERE name = ${escapeSql(bg.source)};
    INSERT INTO backgrounds (name, source_id, page, srd, basic_rules, description, starting_equipment)
    VALUES (${escapeSql(bg.name)}, source_id_var, ${bg.page || 'NULL'}, ${escapeSql(bg.srd)}, ${escapeSql(bg.basicRules)}, ${escapeSql(description)}, ${escapeSql(startingEquipment)}::jsonb)
    RETURNING id INTO background_id_var;
`;
        sqliteInserts += `
INSERT INTO backgrounds (name, source_id, page, srd, basic_rules, description, starting_equipment)
VALUES (${escapeSql(bg.name)}, (SELECT id FROM sources WHERE name = ${escapeSql(bg.source)}), ${bg.page || 'NULL'}, ${bg.srd ? 1: 0}, ${bg.basicRules ? 1: 0}, ${escapeSql(description)}, ${escapeSql(startingEquipment)}); 
        `;
        const sqliteBgId = `(SELECT id FROM backgrounds WHERE name = ${escapeSql(bg.name)} AND source_id = (SELECT id FROM sources WHERE name = ${escapeSql(bg.source)}))`;


        // Skill Proficiencies
        if (bg.skillProficiencies) {
            for (const prof of bg.skillProficiencies) {
                if (prof.choose) {
                    for (const skill of prof.choose.from) {
                        postgresInserts += `
    INSERT INTO background_skill_proficiencies (background_id, skill_id, is_choice, choose_count)
    VALUES (background_id_var, (SELECT id FROM skills WHERE name = ${escapeSql(skill)}), TRUE, ${prof.choose.count || 1});
`;
                        sqliteInserts += `
INSERT INTO background_skill_proficiencies (background_id, skill_id, is_choice, choose_count)
VALUES (${sqliteBgId}, (SELECT id FROM skills WHERE name = ${escapeSql(skill)}), 1, ${prof.choose.count || 1});
`;
                    }
                } else {
                    for (const skill in prof) {
                        postgresInserts += `
    INSERT INTO background_skill_proficiencies (background_id, skill_id)
    VALUES (background_id_var, (SELECT id FROM skills WHERE name = ${escapeSql(skill)}));
`;
                        sqliteInserts += `
INSERT INTO background_skill_proficiencies (background_id, skill_id)
VALUES (${sqliteBgId}, (SELECT id FROM skills WHERE name = ${escapeSql(skill)}));
`;
                    }
                }
            }
        }

        // Language Proficiencies
        if (bg.languageProficiencies) {
            for (const prof of bg.languageProficiencies) {
                if (prof.choose) {
                     for (const lang of prof.choose.from) {
                        postgresInserts += `
    INSERT INTO background_language_proficiencies (background_id, language_id, is_choice, choose_count)
    VALUES (background_id_var, (SELECT id FROM languages WHERE name = ${escapeSql(lang)}), TRUE, ${prof.choose.count || 1});
`;
                        sqliteInserts += `
INSERT INTO background_language_proficiencies (background_id, language_id, is_choice, choose_count)
VALUES (${sqliteBgId}, (SELECT id FROM languages WHERE name = ${escapeSql(lang)}), 1, ${prof.choose.count || 1});
`;
                     }
                } else if (prof.anyStandard) {
                     postgresInserts += `
    INSERT INTO background_language_proficiencies (background_id, language_id, any_standard)
    VALUES (background_id_var, (SELECT id FROM languages WHERE name = 'any'), ${prof.anyStandard});
`;
                     sqliteInserts += `
INSERT INTO background_language_proficiencies (background_id, language_id, any_standard)
VALUES (${sqliteBgId}, (SELECT id FROM languages WHERE name = 'any'), ${prof.anyStandard});
`;
                } else {
                    for (const lang in prof) {
                        postgresInserts += `
    INSERT INTO background_language_proficiencies (background_id, language_id)
    VALUES (background_id_var, (SELECT id FROM languages WHERE name = ${escapeSql(lang)}));
`;
                        sqliteInserts += `
INSERT INTO background_language_proficiencies (background_id, language_id)
VALUES (${sqliteBgId}, (SELECT id FROM languages WHERE name = ${escapeSql(lang)}));
`;
                    }
                }
            }
        }

        // Tool Proficiencies
        if (bg.toolProficiencies) {
            for (const prof of bg.toolProficiencies) {
                if (prof.choose) {
                    for (const tool of prof.choose.from) {
                        postgresInserts += `
    INSERT INTO background_tool_proficiencies (background_id, tool_id, is_choice, choose_count)
    VALUES (background_id_var, (SELECT id FROM tools WHERE name = ${escapeSql(tool)}), TRUE, ${prof.choose.count || 1});
`;
                        sqliteInserts += `
INSERT INTO background_tool_proficiencies (background_id, tool_id, is_choice, choose_count)
VALUES (${sqliteBgId}, (SELECT id FROM tools WHERE name = ${escapeSql(tool)}), 1, ${prof.choose.count || 1});
`;
                    }
                } else {
                    for (const tool in prof) {
                        postgresInserts += `
    INSERT INTO background_tool_proficiencies (background_id, tool_id)
    VALUES (background_id_var, (SELECT id FROM tools WHERE name = ${escapeSql(tool)}));
`;
                        sqliteInserts += `
INSERT INTO background_tool_proficiencies (background_id, tool_id)
VALUES (${sqliteBgId}, (SELECT id FROM tools WHERE name = ${escapeSql(tool)}));
`;
                    }
                }
            }
        }

        postgresInserts += `
END $;
`;
    }


    await fs.writeFile('backgrounds_inserts_postgres.sql', postgresInserts);
    await fs.writeFile('backgrounds_inserts_sqlite.sql', sqliteInserts);
}


async function generateRaces() {
    const racesData = JSON.parse(await fs.readFile(path.join('C:', 'Projects', 'dnd-class-data', 'raw-data', 'races.json'), 'utf8'));
    const races = racesData.race;

    // --- PostgreSQL Schema for Races ---
    const postgresSchema = `
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
    `;

    // --- SQLite Schema for Races ---
    const sqliteSchema = `
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
    `;

    await fs.writeFile('races_schema_postgres.sql', postgresSchema);
    await fs.writeFile('races_schema_sqlite.sql', sqliteSchema);

    // --- Generate Inserts ---
    let postgresInserts = '';
    let sqliteInserts = '';

    const allDamageTypes = new Set();
    const allConditions = new Set();
    races.forEach(r => {
        if (r.resist) r.resist.forEach(res => allDamageTypes.add(res));
        if (r.conditionImmune) r.conditionImmune.forEach(con => allConditions.add(con));
    });

    postgresInserts += [...allDamageTypes].map(d => `INSERT INTO damage_types (name) VALUES (${escapeSql(d)}) ON CONFLICT (name) DO NOTHING;`).join('\n') + '\n';
    sqliteInserts += [...allDamageTypes].map(d => `INSERT OR IGNORE INTO damage_types (name) VALUES (${escapeSql(d)});`).join('\n') + '\n';
    postgresInserts += [...allConditions].map(c => `INSERT INTO conditions (name) VALUES (${escapeSql(c)}) ON CONFLICT (name) DO NOTHING;`).join('\n') + '\n';
    sqliteInserts += [...allConditions].map(c => `INSERT OR IGNORE INTO conditions (name) VALUES (${escapeSql(c)});`).join('\n') + '\n';


    for (const race of races) {
        if (race._copy) continue;

        const description = processEntries(race.entries.filter(e => !e.data || !e.data.isFeature));
        const speed = typeof race.speed === 'number' ? { walk: race.speed } : race.speed || {};
        const sizePostgres = race.size ? `{${race.size.map(s => `"${s}"`).join(',')}}` : 'NULL';
        const sizeSqlite = race.size ? escapeSql(race.size.join(',')) : 'NULL';
        const creatureTypesPostgres = race.creatureTypes ? `{${race.creatureTypes.map(s => `"${s}"`).join(',')}}` : 'NULL';
        const creatureTypesSqlite = race.creatureTypes ? escapeSql(race.creatureTypes.join(',')) : 'NULL';
        const creatureTypeTagsPostgres = race.creatureTypeTags ? `{${race.creatureTypeTags.map(s => `"${s}"`).join(',')}}` : 'NULL';
        const creatureTypeTagsSqlite = race.creatureTypeTags ? escapeSql(race.creatureTypeTags.join(',')) : 'NULL';


        postgresInserts += `
DO $
DECLARE
    source_id_var INTEGER;
    race_id_var INTEGER;
BEGIN
    SELECT id INTO source_id_var FROM sources WHERE name = ${escapeSql(race.source)};
    INSERT INTO races (name, source_id, page, size, speed_walk, speed_fly, speed_swim, age_mature, age_max, darkvision, description, creature_types, creature_type_tags, lineage)
    VALUES (${escapeSql(race.name)}, source_id_var, ${race.page || 'NULL'}, ${sizePostgres}, ${speed.walk || 'NULL'}, ${speed.fly === true ? speed.walk : (speed.fly || 'NULL')}, ${speed.swim || 'NULL'}, ${race.age ? race.age.mature : 'NULL'}, ${race.age ? race.age.max : 'NULL'}, ${race.darkvision || 'NULL'}, ${escapeSql(description)}, ${creatureTypesPostgres}, ${creatureTypeTagsPostgres}, ${escapeSql(race.lineage)})
    RETURNING id INTO race_id_var;
`;
        sqliteInserts += `
INSERT INTO races (name, source_id, page, size, speed_walk, speed_fly, speed_swim, age_mature, age_max, darkvision, description, creature_types, creature_type_tags, lineage)
VALUES (${escapeSql(race.name)}, (SELECT id FROM sources WHERE name = ${escapeSql(race.source)}), ${race.page || 'NULL'}, ${sizeSqlite}, ${speed.walk || 'NULL'}, ${speed.fly === true ? speed.walk : (speed.fly || 'NULL')}, ${speed.swim || 'NULL'}, ${race.age ? race.age.mature : 'NULL'}, ${race.age ? race.age.max : 'NULL'}, ${race.darkvision || 'NULL'}, ${escapeSql(description)}, ${creatureTypesSqlite}, ${creatureTypeTagsSqlite}, ${escapeSql(race.lineage)});
`;
        const sqliteRaceId = `(SELECT id FROM races WHERE name = ${escapeSql(race.name)} AND source_id = (SELECT id FROM sources WHERE name = ${escapeSql(race.source)}))`;

        // Ability Scores
        if (race.ability) {
            for (const abi of race.ability) {
                if (abi.choose) {
                    for (const choice of abi.choose.from) {
                         postgresInserts += `
    INSERT INTO race_ability_scores (race_id, ability, bonus, is_choice, choose_count)
    VALUES (race_id_var, ${escapeSql(choice)}, ${abi.choose.amount || 1}, TRUE, ${abi.choose.count || 1});
`;
                         sqliteInserts += `
INSERT INTO race_ability_scores (race_id, ability, bonus, is_choice, choose_count)
VALUES (${sqliteRaceId}, ${escapeSql(choice)}, ${abi.choose.amount || 1}, 1, ${abi.choose.count || 1});
`;
                    }
                } else {
                    for (const key in abi) {
                        postgresInserts += `
    INSERT INTO race_ability_scores (race_id, ability, bonus)
    VALUES (race_id_var, ${escapeSql(key)}, ${abi[key]});
`;
                        sqliteInserts += `
INSERT INTO race_ability_scores (race_id, ability, bonus)
VALUES (${sqliteRaceId}, ${escapeSql(key)}, ${abi[key]});
`;
                    }
                }
            }
        }

        // Resistances
        if (race.resist) {
            for (const res of race.resist) {
                postgresInserts += `
    INSERT INTO race_resistances (race_id, damage_type_id)
    VALUES (race_id_var, (SELECT id FROM damage_types WHERE name = ${escapeSql(res)}));
`;
                sqliteInserts += `
INSERT INTO race_resistances (race_id, damage_type_id)
VALUES (${sqliteRaceId}, (SELECT id FROM damage_types WHERE name = ${escapeSql(res)}));
`;
            }
        }
        
        // Condition Immunities
        if (race.conditionImmune) {
            for (const con of race.conditionImmune) {
                postgresInserts += `
    INSERT INTO race_condition_immunities (race_id, condition_id)
    VALUES (race_id_var, (SELECT id FROM conditions WHERE name = ${escapeSql(con)}));
`;
                sqliteInserts += `
INSERT INTO race_condition_immunities (race_id, condition_id)
VALUES (${sqliteRaceId}, (SELECT id FROM conditions WHERE name = ${escapeSql(con)}));
`;
            }
        }

        // Language Proficiencies
        if (race.languageProficiencies) {
            for (const prof of race.languageProficiencies) {
                 if (prof.choose) {
                     for (const lang of prof.choose.from) {
                        postgresInserts += `
    INSERT INTO race_language_proficiencies (race_id, language_id, is_choice)
    VALUES (race_id_var, (SELECT id FROM languages WHERE name = ${escapeSql(lang)}), TRUE);
`;
                        sqliteInserts += `
INSERT INTO race_language_proficiencies (race_id, language_id, is_choice)
VALUES (${sqliteRaceId}, (SELECT id FROM languages WHERE name = ${escapeSql(lang)}), 1);
`;
                     }
                } else if (prof.anyStandard) {
                     postgresInserts += `
    INSERT INTO race_language_proficiencies (race_id, language_id, any_standard)
    VALUES (race_id_var, (SELECT id FROM languages WHERE name = 'any'), ${prof.anyStandard});
`;
                     sqliteInserts += `
INSERT INTO race_language_proficiencies (race_id, language_id, any_standard)
VALUES (${sqliteRaceId}, (SELECT id FROM languages WHERE name = 'any'), ${prof.anyStandard});
`;
                } else {
                    for (const lang in prof) {
                        if(lang === 'other') continue;
                        postgresInserts += `
    INSERT INTO race_language_proficiencies (race_id, language_id)
    VALUES (race_id_var, (SELECT id FROM languages WHERE name = ${escapeSql(lang)}));
`;
                        sqliteInserts += `
INSERT INTO race_language_proficiencies (race_id, language_id)
VALUES (${sqliteRaceId}, (SELECT id FROM languages WHERE name = ${escapeSql(lang)}));
`;
                    }
                }
            }
        }

        // Skill Proficiencies
        if (race.skillProficiencies) {
            for (const prof of race.skillProficiencies) {
                if (prof.choose) {
                    for (const skill of prof.choose.from) {
                        postgresInserts += `
    INSERT INTO race_skill_proficiencies (race_id, skill_id, is_choice)
    VALUES (race_id_var, (SELECT id FROM skills WHERE name = ${escapeSql(skill)}), TRUE);
`;
                        sqliteInserts += `
INSERT INTO race_skill_proficiencies (race_id, skill_id, is_choice)
VALUES (${sqliteRaceId}, (SELECT id FROM skills WHERE name = ${escapeSql(skill)}), 1);
`;
                    }
                } else {
                    for (const skill in prof) {
                        postgresInserts += `
    INSERT INTO race_skill_proficiencies (race_id, skill_id)
    VALUES (race_id_var, (SELECT id FROM skills WHERE name = ${escapeSql(skill)}));
`;
                        sqliteInserts += `
INSERT INTO race_skill_proficiencies (race_id, skill_id)
VALUES (${sqliteRaceId}, (SELECT id FROM skills WHERE name = ${escapeSql(skill)}));
`;
                    }
                }
            }
        }

        // Traits
        const traits = race.entries.filter(e => e.name && e.entries);
        for (const trait of traits) {
             postgresInserts += `
    INSERT INTO race_traits (race_id, name, description)
    VALUES (race_id_var, ${escapeSql(trait.name)}, ${escapeSql(processEntries(trait.entries))});
`;
             sqliteInserts += `
INSERT INTO race_traits (race_id, name, description)
VALUES (${sqliteRaceId}, ${escapeSql(trait.name)}, ${escapeSql(processEntries(trait.entries))});
`;
        }


        postgresInserts += `
END $;
`;
    }


    await fs.writeFile('races_inserts_postgres.sql', postgresInserts);
    await fs.writeFile('races_inserts_sqlite.sql', sqliteInserts);
}

async function generateLanguages() {
    const languagesData = JSON.parse(await fs.readFile(path.join('C:', 'Projects', 'dnd-class-data', 'raw-data', 'languages.json'), 'utf8'));
    const languages = languagesData.language;

    const postgresSchema = `
CREATE TABLE IF NOT EXISTS language_scripts (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS languages (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    source_id INTEGER REFERENCES sources(id),
    page INTEGER,
    type TEXT,
    typical_speakers TEXT[],
    script_id INTEGER REFERENCES language_scripts(id),
    description TEXT
);
    `;

    const sqliteSchema = `
CREATE TABLE IF NOT EXISTS language_scripts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS languages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    source_id INTEGER,
    page INTEGER,
    type TEXT,
    typical_speakers TEXT,
    script_id INTEGER,
    description TEXT,
    FOREIGN KEY (source_id) REFERENCES sources(id),
    FOREIGN KEY (script_id) REFERENCES language_scripts(id)
);
    `;

    await fs.writeFile('languages_schema_postgres.sql', postgresSchema);
    await fs.writeFile('languages_schema_sqlite.sql', sqliteSchema);

    let postgresInserts = '';
    let sqliteInserts = '';

    const allScripts = new Set(languages.map(l => l.script).filter(Boolean));

    postgresInserts += [...allScripts].map(s => `INSERT INTO language_scripts (name) VALUES (${escapeSql(s)}) ON CONFLICT (name) DO NOTHING;`).join('\n') + '\n';
    sqliteInserts += [...allScripts].map(s => `INSERT OR IGNORE INTO language_scripts (name) VALUES (${escapeSql(s)});`).join('\n') + '\n';

    for (const lang of languages) {
        const description = processEntries(lang.entries);
        const typicalSpeakersPostgres = lang.typicalSpeakers ? `ARRAY[${lang.typicalSpeakers.map(s => escapeSql(s)).join(',')}]` : 'NULL';
        const typicalSpeakersSqlite = lang.typicalSpeakers ? escapeSql(lang.typicalSpeakers.join(', ')) : 'NULL';

        postgresInserts += `
DO $
DECLARE
    source_id_var INTEGER;
    script_id_var INTEGER;
BEGIN
    SELECT id INTO source_id_var FROM sources WHERE name = ${escapeSql(lang.source)};
    SELECT id INTO script_id_var FROM language_scripts WHERE name = ${escapeSql(lang.script)};
    INSERT INTO languages (name, source_id, page, type, typical_speakers, script_id, description)
    VALUES (${escapeSql(lang.name)}, source_id_var, ${lang.page || 'NULL'}, ${escapeSql(lang.type)}, ${typicalSpeakersPostgres}, script_id_var, ${escapeSql(description)});
END $;
`;
        sqliteInserts += `
INSERT INTO languages (name, source_id, page, type, typical_speakers, script_id, description)
VALUES (${escapeSql(lang.name)}, (SELECT id FROM sources WHERE name = ${escapeSql(lang.source)}), ${lang.page || 'NULL'}, ${escapeSql(lang.type)}, ${typicalSpeakersSqlite}, (SELECT id FROM language_scripts WHERE name = ${escapeSql(lang.script)}), ${escapeSql(description)});
`;
    }

    await fs.writeFile('languages_inserts_postgres.sql', postgresInserts);
    await fs.writeFile('languages_inserts_sqlite.sql', sqliteInserts);
}


(async () => {
    try {
        await generateBackgrounds();
        console.log('Background files generated.');
        await generateRaces();
        console.log('Race files generated.');
        await generateLanguages();
        console.log('Language files generated.');
    } catch (error) {
        console.error('Error generating files:', error);
    }
})();