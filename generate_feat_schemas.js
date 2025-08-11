
const fs = require('fs');
const path = require('path');

function generatePostgresSchema() {
    let schema = `-- PostgreSQL DDL for Feats (Normalized)\n\n`;

    schema += `CREATE TABLE IF NOT EXISTS sources (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    name VARCHAR(255) UNIQUE NOT NULL\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS feats (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    name VARCHAR(255) UNIQUE NOT NULL,\n`;
    schema += `    source_id INTEGER REFERENCES sources(id),\n`;
    schema += `    page INTEGER,\n`;
    schema += `    has_fluff BOOLEAN,\n`;
    schema += `    has_fluff_images BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS feat_prerequisites (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,\n`;
    schema += `    prerequisite_json JSONB\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS feat_abilities (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,\n`;
    schema += `    ability_score_json JSONB\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS feat_tool_proficiencies (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,\n`;
    schema += `    tool_name VARCHAR(255),\n`;
    schema += `    value BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS feat_language_proficiencies (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,\n`;
    schema += `    language_name VARCHAR(255),\n`;
    schema += `    value BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS feat_armor_proficiencies (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,\n`;
    schema += `    armor_type VARCHAR(255),\n`;
    schema += `    value BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS feat_weapon_proficiencies (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,\n`;
    schema += `    weapon_type VARCHAR(255),\n`;
    schema += `    value BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS feat_additional_spells (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,\n`;
    schema += `    spell_data_json JSONB\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS feat_optional_feature_progression (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,\n`;
    schema += `    name VARCHAR(255),\n`;
    schema += `    feature_type_json JSONB,\n`;
    schema += `    progression_json JSONB\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS feat_resistances (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,\n`;
    schema += `    damage_type VARCHAR(255)\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS feat_entries (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,\n`;
    schema += `    entry_order INTEGER NOT NULL,\n`;
    schema += `    type VARCHAR(50),\n`;
    schema += `    name VARCHAR(255),\n`;
    schema += `    content TEXT,\n`;
    schema += `    list_items JSONB,\n`;
    schema += `    table_caption TEXT,\n`;
    schema += `    table_col_labels JSONB,\n`;
    schema += `    table_col_styles JSONB,\n`;
    schema += `    table_rows JSONB,\n`;
    schema += `    raw_json JSONB\n`;
    schema += `);

`;

    return schema;
}

function generateSqliteSchema() {
    let schema = `-- SQLite DDL for Feats (Normalized)\n\n`;

    schema += `CREATE TABLE IF NOT EXISTS sources (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    name TEXT UNIQUE NOT NULL\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS feats (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    name TEXT UNIQUE NOT NULL,\n`;
    schema += `    source_id INTEGER REFERENCES sources(id),\n`;
    schema += `    page INTEGER,\n`;
    schema += `    has_fluff BOOLEAN,\n`;
    schema += `    has_fluff_images BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS feat_prerequisites (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,\n`;
    schema += `    prerequisite_json TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS feat_abilities (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,\n`;
    schema += `    ability_score_json TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS feat_tool_proficiencies (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,\n`;
    schema += `    tool_name TEXT,\n`;
    schema += `    value BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS feat_language_proficiencies (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,\n`;
    schema += `    language_name TEXT,\n`;
    schema += `    value BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS feat_armor_proficiencies (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,\n`;
    schema += `    armor_type TEXT,\n`;
    schema += `    value BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS feat_weapon_proficiencies (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,\n`;
    schema += `    weapon_type TEXT,\n`;
    schema += `    value BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS feat_additional_spells (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,\n`;
    schema += `    spell_data_json TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS feat_optional_feature_progression (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,\n`;
    schema += `    name TEXT,\n`;
    schema += `    feature_type_json TEXT,\n`;
    schema += `    progression_json TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS feat_resistances (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,\n`;
    schema += `    damage_type TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS feat_entries (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    feat_id INTEGER REFERENCES feats(id) ON DELETE CASCADE,\n`;
    schema += `    entry_order INTEGER NOT NULL,\n`;
    schema += `    type TEXT,\n`;
    schema += `    name TEXT,\n`;
    schema += `    content TEXT,\n`;
    schema += `    list_items TEXT,\n`;
    schema += `    table_caption TEXT,\n`;
    schema += `    table_col_labels TEXT,\n`;
    schema += `    table_col_styles TEXT,\n`;
    schema += `    table_rows TEXT,\n`;
    schema += `    raw_json TEXT\n`;
    schema += `);

`;

    return schema;
}

async function main() {
    const scriptDir = 'C:\\Projects\\dnd-class-data';

    // Generate and write PostgreSQL schema
    const postgresSchema = generatePostgresSchema();
    fs.writeFileSync(path.join(scriptDir, 'feat_schema_postgres.sql'), postgresSchema, 'utf-8');
    console.log('Generated feat_schema_postgres.sql in the root directory.');

    // Generate and write SQLite schema
    const sqliteSchema = generateSqliteSchema();
    fs.writeFileSync(path.join(scriptDir, 'feat_schema_sqlite.sql'), sqliteSchema, 'utf-8');
    console.log('Generated feat_schema_sqlite.sql in the root directory.');
}

main();
