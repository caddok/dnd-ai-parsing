
const fs = require('fs');
const path = require('path');

function generatePostgresSchema() {
    let schema = `-- PostgreSQL DDL for Optional Features (Normalized)\n\n`;

    schema += `CREATE TABLE IF NOT EXISTS sources (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    name VARCHAR(255) UNIQUE NOT NULL\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS optional_features (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    name VARCHAR(255) UNIQUE NOT NULL,\n`;
    schema += `    source_id INTEGER REFERENCES sources(id),\n`;
    schema += `    page INTEGER,\n`;
    schema += `    srd BOOLEAN,\n`;
    schema += `    basic_rules BOOLEAN,\n`;
    schema += `    is_class_feature_variant BOOLEAN,\n`;
    schema += `    has_fluff_images BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS optional_feature_types (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,\n`;
    schema += `    type_name VARCHAR(50)\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS optional_feature_prerequisites (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,\n`;
    schema += `    prerequisite_json JSONB\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS optional_feature_consumes (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,\n`;
    schema += `    consume_name VARCHAR(255),\n`;
    schema += `    amount INTEGER\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS optional_feature_additional_spells (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,\n`;
    schema += `    spell_data_json JSONB\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS optional_feature_senses (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,\n`;
    schema += `    sense_type VARCHAR(255),\n`;
    schema += `    range INTEGER\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS optional_feature_skill_proficiencies (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,\n`;
    schema += `    skill_name VARCHAR(255),\n`;
    schema += `    value BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS optional_feature_resistances (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,\n`;
    schema += `    damage_type VARCHAR(255)\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS optional_feature_entries (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,\n`;
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

    schema += `CREATE TABLE IF NOT EXISTS optional_feature_other_sources (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,\n`;
    schema += `    source_name VARCHAR(255),\n`;
    schema += `    page INTEGER\n`;
    schema += `);

`;

    return schema;
}

function generateSqliteSchema() {
    let schema = `-- SQLite DDL for Optional Features (Normalized)\n\n`;

    schema += `CREATE TABLE IF NOT EXISTS sources (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    name TEXT UNIQUE NOT NULL\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS optional_features (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    name TEXT UNIQUE NOT NULL,\n`;
    schema += `    source_id INTEGER REFERENCES sources(id),\n`;
    schema += `    page INTEGER,\n`;
    schema += `    srd BOOLEAN,\n`;
    schema += `    basic_rules BOOLEAN,\n`;
    schema += `    is_class_feature_variant BOOLEAN,\n`;
    schema += `    has_fluff_images BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS optional_feature_types (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,\n`;
    schema += `    type_name TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS optional_feature_prerequisites (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,\n`;
    schema += `    prerequisite_json TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS optional_feature_consumes (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,\n`;
    schema += `    consume_name TEXT,\n`;
    schema += `    amount INTEGER\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS optional_feature_additional_spells (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,\n`;
    schema += `    spell_data_json TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS optional_feature_senses (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,\n`;
    schema += `    sense_type TEXT,\n`;
    schema += `    range INTEGER\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS optional_feature_skill_proficiencies (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,\n`;
    schema += `    skill_name TEXT,\n`;
    schema += `    value BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS optional_feature_resistances (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,\n`;
    schema += `    damage_type TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS optional_feature_entries (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,\n`;
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

    schema += `CREATE TABLE IF NOT EXISTS optional_feature_other_sources (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    optional_feature_id INTEGER REFERENCES optional_features(id) ON DELETE CASCADE,\n`;
    schema += `    source_name TEXT,\n`;
    schema += `    page INTEGER\n`;
    schema += `);

`;

    return schema;
}

async function main() {
    const scriptDir = 'C:\\Projects\\dnd-class-data';

    // Generate and write PostgreSQL schema
    const postgresSchema = generatePostgresSchema();
    fs.writeFileSync(path.join(scriptDir, 'optional_feature_schema_postgres.sql'), postgresSchema, 'utf-8');
    console.log('Generated optional_feature_schema_postgres.sql in the root directory.');

    // Generate and write SQLite schema
    const sqliteSchema = generateSqliteSchema();
    fs.writeFileSync(path.join(scriptDir, 'optional_feature_schema_sqlite.sql'), sqliteSchema, 'utf-8');
    console.log('Generated optional_feature_schema_sqlite.sql in the root directory.');
}

main();
