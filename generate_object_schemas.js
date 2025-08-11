
const fs = require('fs');
const path = require('path');

function generatePostgresSchema() {
    let schema = `-- PostgreSQL DDL for Objects (Normalized)\n\n`;

    schema += `CREATE TABLE IF NOT EXISTS sources (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    name VARCHAR(255) UNIQUE NOT NULL\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS objects (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    name VARCHAR(255) UNIQUE NOT NULL,\n`;
    schema += `    source_id INTEGER REFERENCES sources(id),\n`;
    schema += `    page INTEGER,\n`;
    schema += `    object_type VARCHAR(50),\n`;
    schema += `    ac INTEGER,\n`;
    schema += `    ac_special TEXT,\n`;
    schema += `    hp INTEGER,\n`;
    schema += `    hp_formula VARCHAR(255),\n`;
    schema += `    hp_special TEXT,\n`;
    schema += `    strength INTEGER,\n`;
    schema += `    dexterity INTEGER,\n`;
    schema += `    constitution INTEGER,\n`;
    schema += `    intelligence INTEGER,\n`;
    schema += `    wisdom INTEGER,\n`;
    schema += `    charisma INTEGER,\n`;
    schema += `    speed_walk INTEGER,\n`;
    schema += `    speed_burrow INTEGER,\n`;
    schema += `    speed_climb INTEGER,\n`;
    schema += `    speed_fly INTEGER,\n`;
    schema += `    speed_fly_condition VARCHAR(255),\n`;
    schema += `    speed_swim INTEGER,\n`;
    schema += `    has_token BOOLEAN,\n`;
    schema += `    token_credit TEXT,\n`;
    schema += `    has_fluff_images BOOLEAN,\n`;
    schema += `    is_npc BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS object_sizes (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    object_id INTEGER REFERENCES objects(id) ON DELETE CASCADE,\n`;
    schema += `    size_char CHAR(1)\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS object_immunities (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    object_id INTEGER REFERENCES objects(id) ON DELETE CASCADE,\n`;
    schema += `    damage_type VARCHAR(255),\n`;
    schema += `    special_note TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS object_resistances (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    object_id INTEGER REFERENCES objects(id) ON DELETE CASCADE,\n`;
    schema += `    damage_type VARCHAR(255)\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS object_vulnerabilities (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    object_id INTEGER REFERENCES objects(id) ON DELETE CASCADE,\n`;
    schema += `    damage_type VARCHAR(255)\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS object_entries (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    object_id INTEGER REFERENCES objects(id) ON DELETE CASCADE,\n`;
    schema += `    entry_order INTEGER NOT NULL,\n`;
    schema += `    type VARCHAR(50),\n`;
    schema += `    name VARCHAR(255),\n`;
    schema += `    content TEXT,\n`;
    schema += `    list_items JSONB,\n`;
    schema += `    table_caption TEXT,\n`;
    schema += `    table_col_labels JSONB,\n`;
    schema += `    table_col_styles JSONB,\n`;
    schema += `    table_rows JSONB,\n`;
    schema += `    image_href_type VARCHAR(50),\n`;
    schema += `    image_href_path TEXT,\n`;
    schema += `    image_title TEXT,\n`;
    schema += `    image_width INTEGER,\n`;
    schema += `    image_height INTEGER,\n`;
    schema += `    raw_json JSONB\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS object_action_entries (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    object_id INTEGER REFERENCES objects(id) ON DELETE CASCADE,\n`;
    schema += `    entry_order INTEGER NOT NULL,\n`;
    schema += `    type VARCHAR(50),\n`;
    schema += `    name VARCHAR(255),\n`;
    schema += `    entries_json JSONB\n`;
    schema += `);

`;

    return schema;
}

function generateSqliteSchema() {
    let schema = `-- SQLite DDL for Objects (Normalized)\n\n`;

    schema += `CREATE TABLE IF NOT EXISTS sources (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    name TEXT UNIQUE NOT NULL\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS objects (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    name TEXT UNIQUE NOT NULL,\n`;
    schema += `    source_id INTEGER REFERENCES sources(id),\n`;
    schema += `    page INTEGER,\n`;
    schema += `    object_type TEXT,\n`;
    schema += `    ac INTEGER,\n`;
    schema += `    ac_special TEXT,\n`;
    schema += `    hp INTEGER,\n`;
    schema += `    hp_formula TEXT,\n`;
    schema += `    hp_special TEXT,\n`;
    schema += `    strength INTEGER,\n`;
    schema += `    dexterity INTEGER,\n`;
    schema += `    constitution INTEGER,\n`;
    schema += `    intelligence INTEGER,\n`;
    schema += `    wisdom INTEGER,\n`;
    schema += `    charisma INTEGER,\n`;
    schema += `    speed_walk INTEGER,\n`;
    schema += `    speed_burrow INTEGER,\n`;
    schema += `    speed_climb INTEGER,\n`;
    schema += `    speed_fly INTEGER,\n`;
    schema += `    speed_fly_condition TEXT,\n`;
    schema += `    speed_swim INTEGER,\n`;
    schema += `    has_token BOOLEAN,\n`;
    schema += `    token_credit TEXT,\n`;
    schema += `    has_fluff_images BOOLEAN,\n`;
    schema += `    is_npc BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS object_sizes (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    object_id INTEGER REFERENCES objects(id) ON DELETE CASCADE,\n`;
    schema += `    size_char CHAR(1)\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS object_immunities (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    object_id INTEGER REFERENCES objects(id) ON DELETE CASCADE,\n`;
    schema += `    damage_type TEXT,\n`;
    schema += `    special_note TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS object_resistances (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    object_id INTEGER REFERENCES objects(id) ON DELETE CASCADE,\n`;
    schema += `    damage_type TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS object_vulnerabilities (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    object_id INTEGER REFERENCES objects(id) ON DELETE CASCADE,\n`;
    schema += `    damage_type TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS object_entries (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    object_id INTEGER REFERENCES objects(id) ON DELETE CASCADE,\n`;
    schema += `    entry_order INTEGER NOT NULL,\n`;
    schema += `    type TEXT,\n`;
    schema += `    name TEXT,\n`;
    schema += `    content TEXT,\n`;
    schema += `    list_items TEXT,\n`;
    schema += `    table_caption TEXT,\n`;
    schema += `    table_col_labels TEXT,\n`;
    schema += `    table_col_styles TEXT,\n`;
    schema += `    table_rows TEXT,\n`;
    schema += `    image_href_type TEXT,\n`;
    schema += `    image_href_path TEXT,\n`;
    schema += `    image_title TEXT,\n`;
    schema += `    image_width INTEGER,\n`;
    schema += `    image_height INTEGER,\n`;
    schema += `    raw_json TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS object_action_entries (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    object_id INTEGER REFERENCES objects(id) ON DELETE CASCADE,\n`;
    schema += `    entry_order INTEGER NOT NULL,\n`;
    schema += `    type TEXT,\n`;
    schema += `    name TEXT,\n`;
    schema += `    entries_json TEXT\n`;
    schema += `);

`;

    return schema;
}

async function main() {
    const scriptDir = 'C:\\Projects\\dnd-class-data';

    // Generate and write PostgreSQL schema
    const postgresSchema = generatePostgresSchema();
    fs.writeFileSync(path.join(scriptDir, 'object_schema_postgres.sql'), postgresSchema, 'utf-8');
    console.log('Generated object_schema_postgres.sql in the root directory.');

    // Generate and write SQLite schema
    const sqliteSchema = generateSqliteSchema();
    fs.writeFileSync(path.join(scriptDir, 'object_schema_sqlite.sql'), sqliteSchema, 'utf-8');
    console.log('Generated object_schema_sqlite.sql in the root directory.');
}

main();
