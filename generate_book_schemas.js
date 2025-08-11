
const fs = require('fs');
const path = require('path');

function generatePostgresSchema() {
    let schema = `-- PostgreSQL DDL for Books (Normalized)\n\n`;

    schema += `CREATE TABLE IF NOT EXISTS sources (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    name VARCHAR(255) UNIQUE NOT NULL\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS books (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    name VARCHAR(255) UNIQUE NOT NULL,\n`;
    schema += `    source_id INTEGER REFERENCES sources(id)\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS book_sections (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,\n`;
    schema += `    name VARCHAR(255),\n`;
    schema += `    page INTEGER,\n`;
    schema += `    type VARCHAR(50),\n`;
    schema += `    data JSONB\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS book_entries (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    section_id INTEGER REFERENCES book_sections(id) ON DELETE CASCADE,\n`;
    schema += `    entry_order INTEGER NOT NULL,\n`;
    schema += `    type VARCHAR(50),\n`;
    schema += `    name VARCHAR(255),\n`;
    schema += `    content TEXT,\n`;
    schema += `    list_items JSONB,\n`;
    schema += `    table_caption TEXT,\n`;
    schema += `    table_col_labels JSONB,\n`;
    schema += `    table_rows JSONB,\n`;
    schema += `    image_href_type VARCHAR(50),\n`;
    schema += `    image_href_path TEXT,\n`;
    schema += `    image_title VARCHAR(255),\n`;
    schema += `    image_width INTEGER,\n`;
    schema += `    image_height INTEGER,\n`;
    schema += `    raw_json JSONB\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS book_other_sources (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,\n`;
    schema += `    source_name VARCHAR(255),\n`;
    schema += `    page INTEGER\n`;
    schema += `);

`;

    return schema;
}

function generateSqliteSchema() {
    let schema = `-- SQLite DDL for Books (Normalized)\n\n`;

    schema += `CREATE TABLE IF NOT EXISTS sources (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    name TEXT UNIQUE NOT NULL\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS books (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    name TEXT UNIQUE NOT NULL,\n`;
    schema += `    source_id INTEGER REFERENCES sources(id)\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS book_sections (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,\n`;
    schema += `    name TEXT,\n`;
    schema += `    page INTEGER,\n`;
    schema += `    type TEXT,\n`;
    schema += `    data TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS book_entries (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    section_id INTEGER REFERENCES book_sections(id) ON DELETE CASCADE,\n`;
    schema += `    entry_order INTEGER NOT NULL,\n`;
    schema += `    type TEXT,\n`;
    schema += `    name TEXT,\n`;
    schema += `    content TEXT,\n`;
    schema += `    list_items TEXT,\n`;
    schema += `    table_caption TEXT,\n`;
    schema += `    table_col_labels TEXT,\n`;
    schema += `    table_rows TEXT,\n`;
    schema += `    image_href_type TEXT,\n`;
    schema += `    image_href_path TEXT,\n`;
    schema += `    image_title TEXT,\n`;
    schema += `    image_width INTEGER,\n`;
    schema += `    image_height INTEGER,\n`;
    schema += `    raw_json TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS book_other_sources (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,\n`;
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
    fs.writeFileSync(path.join(scriptDir, 'book_schema_postgres.sql'), postgresSchema, 'utf-8');
    console.log('Generated book_schema_postgres.sql in the root directory.');

    // Generate and write SQLite schema
    const sqliteSchema = generateSqliteSchema();
    fs.writeFileSync(path.join(scriptDir, 'book_schema_sqlite.sql'), sqliteSchema, 'utf-8');
    console.log('Generated book_schema_sqlite.sql in the root directory.');
}

main();
