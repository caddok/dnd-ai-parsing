
const fs = require('fs');
const path = require('path');

function generatePostgresSchema() {
    let schema = `-- PostgreSQL DDL for Bestiary (Normalized)\n\n`;

    schema += `CREATE TABLE IF NOT EXISTS sources (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    name VARCHAR(255) UNIQUE NOT NULL\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monsters (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    name VARCHAR(255) UNIQUE NOT NULL,\n`;
    schema += `    source_id INTEGER REFERENCES sources(id),\n`;
    schema += `    page INTEGER,\n`;
    schema += `    size VARCHAR(50),\n`;
    schema += `    type_main VARCHAR(255),\n`;
    schema += `    alignment_main VARCHAR(50),\n`;
    schema += `    alignment_prefix VARCHAR(255),\n`;
    schema += `    hp_average INTEGER,\n`;
    schema += `    hp_formula VARCHAR(255),\n`;
    schema += `    strength INTEGER,\n`;
    schema += `    dexterity INTEGER,\n`;
    schema += `    constitution INTEGER,\n`;
    schema += `    intelligence INTEGER,\n`;
    schema += `    wisdom INTEGER,\n`;
    schema += `    charisma INTEGER,\n`;
    schema += `    passive_perception INTEGER,\n`;
    schema += `    challenge_rating_cr VARCHAR(50),\n`;
    schema += `    challenge_rating_coven VARCHAR(50),\n`;
    schema += `    has_token BOOLEAN,\n`;
    schema += `    has_fluff BOOLEAN,\n`;
    schema += `    has_fluff_images BOOLEAN,\n`;
    schema += `    dragon_casting_color VARCHAR(255),\n`;
    schema += `    dragon_age VARCHAR(255),\n`;
    schema += `    is_named_creature BOOLEAN,\n`;
    schema += `    sound_clip_type VARCHAR(255),\n`;
    schema += `    sound_clip_path VARCHAR(255)\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_speeds (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    speed_type VARCHAR(255) NOT NULL,\n`;
    schema += `    speed_value INTEGER NOT NULL,\n`;
    schema += `    condition TEXT,\n`;
    schema += `    can_hover BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_type_tags (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    tag VARCHAR(255)\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_ac_entries (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    ac_value INTEGER,\n`;
    schema += `    ac_type VARCHAR(255),\n`;
    schema += `    ac_condition TEXT,\n`;
    schema += `    ac_braces BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_saves (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    ability VARCHAR(10),\n`;
    schema += `    modifier VARCHAR(10)\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_skills (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    skill_id INTEGER REFERENCES skills(id),\n`;
    schema += `    modifier VARCHAR(10),\n`;
    schema += `    other_data JSONB\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_senses_list (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    sense_description TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_resistances (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    damage_type VARCHAR(255),\n`;
    schema += `    note TEXT,\n`;
    schema += `    condition BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_immunities (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    damage_type VARCHAR(255),\n`;
    schema += `    note TEXT,\n`;
    schema += `    condition BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_condition_immunities (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    condition_name VARCHAR(255)\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_languages_list (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    language_id INTEGER REFERENCES languages(id),\n`;
    schema += `    choice_count INTEGER\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_spellcasting_entries (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    name VARCHAR(255),\n`;
    schema += `    type VARCHAR(255),\n`;
    schema += `    ability VARCHAR(10),\n`;
    schema += `    header_entries JSONB,\n`;
    schema += `    spells_by_level JSONB,\n`;
    schema += `    will_spells JSONB,\n`;
    schema += `    daily_spells JSONB,\n`;
    schema += `    footer_entries JSONB,\n`;
    schema += `    display_as VARCHAR(255)\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_traits (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    name VARCHAR(255),\n`;
    schema += `    entries JSONB\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_actions (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    name VARCHAR(255),\n`;
    schema += `    entries JSONB\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_reactions (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    name VARCHAR(255),\n`;
    schema += `    entries JSONB\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_legendary_actions (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    name VARCHAR(255),\n`;
    schema += `    entries JSONB,\n`;
    schema += `    cost INTEGER\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_legendary_group (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    name VARCHAR(255),\n`;
    schema += `    source VARCHAR(255)\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_environments (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    environment_name VARCHAR(255)\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_attached_items (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    item_name VARCHAR(255)\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_tags (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    tag_type VARCHAR(255),\n`;
    schema += `    tag_name VARCHAR(255)\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_variants (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    type VARCHAR(255),\n`;
    schema += `    name VARCHAR(255),\n`;
    schema += `    entries JSONB,\n`;
    schema += `    version_name VARCHAR(255),\n`;
    schema += `    add_headers_as VARCHAR(255)\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_other_sources (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    source_name VARCHAR(255),\n`;
    schema += `    page INTEGER\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_reprinted_as (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    reprinted_name VARCHAR(255)\n`;
    schema += `);

`;

    return schema;
}

function generateSqliteSchema() {
    let schema = `-- SQLite DDL for Bestiary (Normalized)\n\n`;

    schema += `CREATE TABLE IF NOT EXISTS sources (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    name TEXT UNIQUE NOT NULL\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monsters (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    name TEXT UNIQUE NOT NULL,\n`;
    schema += `    source_id INTEGER REFERENCES sources(id),\n`;
    schema += `    page INTEGER,\n`;
    schema += `    size TEXT,\n`;
    schema += `    type_main TEXT,\n`;
    schema += `    alignment_main TEXT,\n`;
    schema += `    alignment_prefix TEXT,\n`;
    schema += `    hp_average INTEGER,\n`;
    schema += `    hp_formula TEXT,\n`;
    schema += `    strength INTEGER,\n`;
    schema += `    dexterity INTEGER,\n`;
    schema += `    constitution INTEGER,\n`;
    schema += `    intelligence INTEGER,\n`;
    schema += `    wisdom INTEGER,\n`;
    schema += `    charisma INTEGER,\n`;
    schema += `    passive_perception INTEGER,\n`;
    schema += `    challenge_rating_cr TEXT,\n`;
    schema += `    challenge_rating_coven TEXT,\n`;
    schema += `    has_token BOOLEAN,\n`;
    schema += `    has_fluff BOOLEAN,\n`;
    schema += `    has_fluff_images BOOLEAN,\n`;
    schema += `    dragon_casting_color TEXT,\n`;
    schema += `    dragon_age TEXT,\n`;
    schema += `    is_named_creature BOOLEAN,\n`;
    schema += `    sound_clip_type TEXT,\n`;
    schema += `    sound_clip_path TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_speeds (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    speed_type TEXT NOT NULL,\n`;
    schema += `    speed_value INTEGER NOT NULL,\n`;
    schema += `    condition TEXT,\n`;
    schema += `    can_hover BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_type_tags (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    tag TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_ac_entries (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    ac_value INTEGER,\n`;
    schema += `    ac_type TEXT,\n`;
    schema += `    ac_condition TEXT,\n`;
    schema += `    ac_braces BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_saves (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    ability TEXT,\n`;
    schema += `    modifier TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_skills (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    skill_id INTEGER REFERENCES skills(id),\n`;
    schema += `    modifier TEXT,\n`;
    schema += `    other_data TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_senses_list (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    sense_description TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_resistances (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    damage_type TEXT,\n`;
    schema += `    note TEXT,\n`;
    schema += `    condition BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_immunities (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    damage_type TEXT,\n`;
    schema += `    note TEXT,\n`;
    schema += `    condition BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_condition_immunities (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    condition_name TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_languages_list (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    language_id INTEGER REFERENCES languages(id),\n`;
    schema += `    choice_count INTEGER\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_spellcasting_entries (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    name TEXT,\n`;
    schema += `    type TEXT,\n`;
    schema += `    ability TEXT,\n`;
    schema += `    header_entries TEXT,\n`;
    schema += `    spells_by_level TEXT,\n`;
    schema += `    will_spells TEXT,\n`;
    schema += `    daily_spells TEXT,\n`;
    schema += `    footer_entries TEXT,\n`;
    schema += `    display_as TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_traits (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    name TEXT,\n`;
    schema += `    entries TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_actions (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    name TEXT,\n`;
    schema += `    entries TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_reactions (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    name TEXT,\n`;
    schema += `    entries TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_legendary_actions (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    name TEXT,\n`;
    schema += `    entries TEXT,\n`;
    schema += `    cost INTEGER\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_legendary_group (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    name TEXT,\n`;
    schema += `    source TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_environments (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    environment_name TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_attached_items (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    item_name TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_tags (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    tag_type TEXT,\n`;
    schema += `    tag_name TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_variants (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    type TEXT,\n`;
    schema += `    name TEXT,\n`;
    schema += `    entries TEXT,\n`;
    schema += `    version_name TEXT,\n`;
    schema += `    add_headers_as TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_other_sources (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    source_name TEXT,\n`;
    schema += `    page INTEGER\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monster_reprinted_as (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    monster_id INTEGER REFERENCES monsters(id) ON DELETE CASCADE,\n`;
    schema += `    reprinted_name TEXT\n`;
    schema += `);

`;

    return schema;
}

async function main() {
    const scriptDir = 'C:\\Projects\\dnd-class-data';

    // Generate and write PostgreSQL schema
    const postgresSchema = generatePostgresSchema();
    fs.writeFileSync(path.join(scriptDir, 'bestiary_schema_postgres.sql'), postgresSchema, 'utf-8');
    console.log('Generated bestiary_schema_postgres.sql in the root directory.');

    // Generate and write SQLite schema
    const sqliteSchema = generateSqliteSchema();
    fs.writeFileSync(path.join(scriptDir, 'bestiary_schema_sqlite.sql'), sqliteSchema, 'utf-8');
    console.log('Generated bestiary_schema_sqlite.sql in the root directory.');
}

main();
