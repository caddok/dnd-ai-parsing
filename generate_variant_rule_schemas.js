
const fs = require('fs');
const path = require('path');

function generatePostgresSchema() {
    let schema = `-- PostgreSQL DDL for Variant Rules (Normalized)\n\n`;

    schema += `CREATE TABLE IF NOT EXISTS sources (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    name VARCHAR(255) UNIQUE NOT NULL\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS variant_rules (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    name VARCHAR(255) UNIQUE NOT NULL,\n`;
    schema += `    source_id INTEGER REFERENCES sources(id),\n`;
    schema += `    page INTEGER,\n`;
    schema += `    rule_type VARCHAR(50),\n`;
    schema += `    type_main VARCHAR(255)\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS variant_rule_entries (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    variant_rule_id INTEGER REFERENCES variant_rules(id) ON DELETE CASCADE,\n`;
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

    schema += `CREATE TABLE IF NOT EXISTS variant_rule_other_sources (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    variant_rule_id INTEGER REFERENCES variant_rules(id) ON DELETE CASCADE,\n`;
    schema += `    source_name VARCHAR(255),\n`;
    schema += `    page INTEGER\n`;
    schema += `);

`;

    return schema;
}

function generateSqliteSchema() {
    let schema = `-- SQLite DDL for Variant Rules (Normalized)\n\n`;

    schema += `CREATE TABLE IF NOT EXISTS sources (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    name TEXT UNIQUE NOT NULL\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS variant_rules (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    name TEXT UNIQUE NOT NULL,\n`;
    schema += `    source_id INTEGER REFERENCES sources(id),\n`;
    schema += `    page INTEGER,\n`;
    schema += `    rule_type TEXT,\n`;
    schema += `    type_main TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS variant_rule_entries (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    variant_rule_id INTEGER REFERENCES variant_rules(id) ON DELETE CASCADE,\n`;
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

    schema += `CREATE TABLE IF NOT EXISTS variant_rule_other_sources (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    variant_rule_id INTEGER REFERENCES variant_rules(id) ON DELETE CASCADE,\n`;
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
    fs.writeFileSync(path.join(scriptDir, 'variant_rule_schema_postgres.sql'), postgresSchema, 'utf-8');
    console.log('Generated variant_rule_schema_postgres.sql in the root directory.');

    // Generate and write SQLite schema
    const sqliteSchema = generateSqliteSchema();
    fs.writeFileSync(path.join(scriptDir, 'variant_rule_schema_sqlite.sql'), sqliteSchema, 'utf-8');
    console.log('Generated variant_rule_schema_sqlite.sql in the root directory.');
}

main();
