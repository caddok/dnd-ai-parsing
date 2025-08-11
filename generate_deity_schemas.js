
const fs = require('fs');
const path = require('path');

function generatePostgresSchema() {
    let schema = `-- PostgreSQL DDL for Deities (Normalized)\n\n`;

    schema += `CREATE TABLE IF NOT EXISTS sources (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    name VARCHAR(255) UNIQUE NOT NULL\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS deities (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    name VARCHAR(255) UNIQUE NOT NULL,\n`;
    schema += `    source_id INTEGER REFERENCES sources(id),\n`;
    schema += `    page INTEGER,\n`;
    schema += `    pantheon VARCHAR(255),\n`;
    schema += `    title VARCHAR(255),\n`;
    schema += `    category VARCHAR(255),\n`;
    schema += `    province TEXT,\n`;
    schema += `    symbol TEXT,\n`;
    schema += `    piety BOOLEAN,\n`;
    schema += `    reprint_alias VARCHAR(255),\n`;
    schema += `    custom_extension_of TEXT,\n`;
    schema += `    symbol_img_type VARCHAR(50),\n`;
    schema += `    symbol_img_path TEXT,\n`;
    schema += `    symbol_img_credit TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS deity_alt_names (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    deity_id INTEGER REFERENCES deities(id) ON DELETE CASCADE,\n`;
    schema += `    alt_name VARCHAR(255)\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS deity_alignments (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    deity_id INTEGER REFERENCES deities(id) ON DELETE CASCADE,\n`;
    schema += `    alignment_char CHAR(1)\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS deity_domains (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    deity_id INTEGER REFERENCES deities(id) ON DELETE CASCADE,\n`;
    schema += `    domain_name VARCHAR(255)\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS deity_entries (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    deity_id INTEGER REFERENCES deities(id) ON DELETE CASCADE,\n`;
    schema += `    entry_order INTEGER NOT NULL,\n`;
    schema += `    type VARCHAR(50),\n`;
    schema += `    name TEXT,\n`;
    schema += `    content TEXT,\n`;
    schema += `    list_items JSONB,\n`;
    schema += `    table_caption TEXT,\n`;
    schema += `    table_col_labels JSONB,\n`;
    schema += `    table_col_styles JSONB,\n`;
    schema += `    table_rows JSONB,\n`;
    schema += `    footnotes JSONB,\n`;
    schema += `    image_href_type VARCHAR(50),\n`;
    schema += `    image_href_path TEXT,\n`;
    schema += `    image_credit TEXT,\n`;
    schema += `    raw_json JSONB\n`;
    schema += `);

`;

    return schema;
}

function generateSqliteSchema() {
    let schema = `-- SQLite DDL for Deities (Normalized)\n\n`;

    schema += `CREATE TABLE IF NOT EXISTS sources (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    name TEXT UNIQUE NOT NULL\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS deities (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    name TEXT UNIQUE NOT NULL,\n`;
    schema += `    source_id INTEGER REFERENCES sources(id),\n`;
    schema += `    page INTEGER,\n`;
    schema += `    pantheon TEXT,\n`;
    schema += `    title TEXT,\n`;
    schema += `    category TEXT,\n`;
    schema += `    province TEXT,\n`;
    schema += `    symbol TEXT,\n`;
    schema += `    piety BOOLEAN,\n`;
    schema += `    reprint_alias TEXT,\n`;
    schema += `    custom_extension_of TEXT,\n`;
    schema += `    symbol_img_type TEXT,\n`;
    schema += `    symbol_img_path TEXT,\n`;
    schema += `    symbol_img_credit TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS deity_alt_names (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    deity_id INTEGER REFERENCES deities(id) ON DELETE CASCADE,\n`;
    schema += `    alt_name TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS deity_alignments (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    deity_id INTEGER REFERENCES deities(id) ON DELETE CASCADE,\n`;
    schema += `    alignment_char CHAR(1)\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS deity_domains (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    deity_id INTEGER REFERENCES deities(id) ON DELETE CASCADE,\n`;
    schema += `    domain_name TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS deity_entries (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    deity_id INTEGER REFERENCES deities(id) ON DELETE CASCADE,\n`;
    schema += `    entry_order INTEGER NOT NULL,\n`;
    schema += `    type TEXT,\n`;
    schema += `    name TEXT,\n`;
    schema += `    content TEXT,\n`;
    schema += `    list_items TEXT,\n`;
    schema += `    table_caption TEXT,\n`;
    schema += `    table_col_labels TEXT,\n`;
    schema += `    table_col_styles TEXT,\n`;
    schema += `    table_rows TEXT,\n`;
    schema += `    footnotes TEXT,\n`;
    schema += `    image_href_type TEXT,\n`;
    schema += `    image_href_path TEXT,\n`;
    schema += `    image_credit TEXT,\n`;
    schema += `    raw_json TEXT\n`;
    schema += `);

`;

    return schema;
}

async function main() {
    const scriptDir = 'C:\\Projects\\dnd-class-data';

    // Generate and write PostgreSQL schema
    const postgresSchema = generatePostgresSchema();
    fs.writeFileSync(path.join(scriptDir, 'deity_schema_postgres.sql'), postgresSchema, 'utf-8');
    console.log('Generated deity_schema_postgres.sql in the root directory.');

    // Generate and write SQLite schema
    const sqliteSchema = generateSqliteSchema();
    fs.writeFileSync(path.join(scriptDir, 'deity_schema_sqlite.sql'), sqliteSchema, 'utf-8');
    console.log('Generated deity_schema_sqlite.sql in the root directory.');
}

main();
