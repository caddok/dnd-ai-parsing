
const fs = require('fs');
const path = require('path');

function generatePostgresSchema() {
    let schema = `-- PostgreSQL DDL for Conditions and Diseases (Normalized)\n\n`;

    schema += `CREATE TABLE IF NOT EXISTS sources (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    name VARCHAR(255) UNIQUE NOT NULL\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS conditions (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    name VARCHAR(255) UNIQUE NOT NULL,\n`;
    schema += `    source_id INTEGER REFERENCES sources(id),\n`;
    schema += `    page INTEGER,\n`;
    schema += `    srd BOOLEAN,\n`;
    schema += `    basic_rules BOOLEAN,\n`;
    schema += `    has_fluff_images BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS diseases (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    name VARCHAR(255) UNIQUE NOT NULL,\n`;
    schema += `    source_id INTEGER REFERENCES sources(id),\n`;
    schema += `    page INTEGER\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS condition_entries (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    condition_id INTEGER REFERENCES conditions(id) ON DELETE CASCADE,\n`;
    schema += `    entry_order INTEGER NOT NULL,\n`;
    schema += `    type VARCHAR(50),\n`;
    schema += `    content TEXT,\n`;
    schema += `    list_items JSONB,\n`;
    schema += `    table_caption TEXT,\n`;
    schema += `    table_col_labels JSONB,\n`;
    schema += `    table_rows JSONB\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS disease_entries (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    disease_id INTEGER REFERENCES diseases(id) ON DELETE CASCADE,\n`;
    schema += `    entry_order INTEGER NOT NULL,\n`;
    schema += `    type VARCHAR(50),\n`;
    schema += `    name TEXT,\n`;
    schema += `    content TEXT,\n`;
    schema += `    list_items JSONB,\n`;
    schema += `    table_caption TEXT,\n`;
    schema += `    table_col_labels JSONB,\n`;
    schema += `    table_rows JSONB\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS condition_other_sources (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    condition_id INTEGER REFERENCES conditions(id) ON DELETE CASCADE,\n`;
    schema += `    source_name VARCHAR(255),\n`;
    schema += `    page INTEGER\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS disease_other_sources (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    disease_id INTEGER REFERENCES diseases(id) ON DELETE CASCADE,\n`;
    schema += `    source_name VARCHAR(255),\n`;
    schema += `    page INTEGER\n`;
    schema += `);

`;

    return schema;
}

function generateSqliteSchema() {
    let schema = `-- SQLite DDL for Conditions and Diseases (Normalized)\n\n`;

    schema += `CREATE TABLE IF NOT EXISTS sources (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    name TEXT UNIQUE NOT NULL\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS conditions (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    name TEXT UNIQUE NOT NULL,\n`;
    schema += `    source_id INTEGER REFERENCES sources(id),\n`;
    schema += `    page INTEGER,\n`;
    schema += `    srd BOOLEAN,\n`;
    schema += `    basic_rules BOOLEAN,\n`;
    schema += `    has_fluff_images BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS diseases (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    name TEXT UNIQUE NOT NULL,\n`;
    schema += `    source_id INTEGER REFERENCES sources(id),\n`;
    schema += `    page INTEGER\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS condition_entries (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    condition_id INTEGER REFERENCES conditions(id) ON DELETE CASCADE,\n`;
    schema += `    entry_order INTEGER NOT NULL,\n`;
    schema += `    type TEXT,\n`;
    schema += `    content TEXT,\n`;
    schema += `    list_items TEXT,\n`;
    schema += `    table_caption TEXT,\n`;
    schema += `    table_col_labels TEXT,\n`;
    schema += `    table_rows TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS disease_entries (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    disease_id INTEGER REFERENCES diseases(id) ON DELETE CASCADE,\n`;
    schema += `    entry_order INTEGER NOT NULL,\n`;
    schema += `    type TEXT,\n`;
    schema += `    name TEXT,\n`;
    schema += `    content TEXT,\n`;
    schema += `    list_items TEXT,\n`;
    schema += `    table_caption TEXT,\n`;
    schema += `    table_col_labels TEXT,\n`;
    schema += `    table_rows TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS condition_other_sources (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    condition_id INTEGER REFERENCES conditions(id) ON DELETE CASCADE,\n`;
    schema += `    source_name TEXT,\n`;
    schema += `    page INTEGER\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS disease_other_sources (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    disease_id INTEGER REFERENCES diseases(id) ON DELETE CASCADE,\n`;
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
    fs.writeFileSync(path.join(scriptDir, 'conditions_diseases_schema_postgres.sql'), postgresSchema, 'utf-8');
    console.log('Generated conditions_diseases_schema_postgres.sql in the root directory.');

    // Generate and write SQLite schema
    const sqliteSchema = generateSqliteSchema();
    fs.writeFileSync(path.join(scriptDir, 'conditions_diseases_schema_sqlite.sql'), sqliteSchema, 'utf-8');
    console.log('Generated conditions_diseases_schema_sqlite.sql in the root directory.');
}

main();
