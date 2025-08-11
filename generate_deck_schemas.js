
const fs = require('fs');
const path = require('path');

function generatePostgresSchema() {
    let schema = `-- PostgreSQL DDL for Decks (Normalized)\n\n`;

    schema += `CREATE TABLE IF NOT EXISTS sources (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    name VARCHAR(255) UNIQUE NOT NULL\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS decks (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    name VARCHAR(255) UNIQUE NOT NULL,\n`;
    schema += `    source_id INTEGER REFERENCES sources(id),\n`;
    schema += `    page INTEGER,\n`;
    schema += `    has_card_art BOOLEAN,\n`;
    schema += `    back_image_type VARCHAR(50),\n`;
    schema += `    back_image_path TEXT,\n`;
    schema += `    back_image_width INTEGER,\n`;
    schema += `    back_image_height INTEGER,\n`;
    schema += `    back_image_credit TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS deck_cards (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    deck_id INTEGER REFERENCES decks(id) ON DELETE CASCADE,\n`;
    schema += `    uid TEXT,\n`;
    schema += `    replacement BOOLEAN,\n`;
    schema += `    count INTEGER\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS deck_entries (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    deck_id INTEGER REFERENCES decks(id) ON DELETE CASCADE,\n`;
    schema += `    entry_order INTEGER NOT NULL,\n`;
    schema += `    type VARCHAR(50),\n`;
    schema += `    content TEXT,\n`;
    schema += `    list_items JSONB,\n`;
    schema += `    table_caption TEXT,\n`;
    schema += `    table_col_labels JSONB,\n`;
    schema += `    table_col_styles JSONB,\n`;
    schema += `    table_rows JSONB,\n`;
    schema += `    footnotes JSONB,\n`;
    schema += `    raw_json JSONB\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS deck_other_sources (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    deck_id INTEGER REFERENCES decks(id) ON DELETE CASCADE,\n`;
    schema += `    source_name VARCHAR(255),\n`;
    schema += `    page INTEGER\n`;
    schema += `);

`;

    return schema;
}

function generateSqliteSchema() {
    let schema = `-- SQLite DDL for Decks (Normalized)\n\n`;

    schema += `CREATE TABLE IF NOT EXISTS sources (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    name TEXT UNIQUE NOT NULL\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS decks (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    name TEXT UNIQUE NOT NULL,\n`;
    schema += `    source_id INTEGER REFERENCES sources(id),\n`;
    schema += `    page INTEGER,\n`;
    schema += `    has_card_art BOOLEAN,\n`;
    schema += `    back_image_type TEXT,\n`;
    schema += `    back_image_path TEXT,\n`;
    schema += `    back_image_width INTEGER,\n`;
    schema += `    back_image_height INTEGER,\n`;
    schema += `    back_image_credit TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS deck_cards (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    deck_id INTEGER REFERENCES decks(id) ON DELETE CASCADE,\n`;
    schema += `    uid TEXT,\n`;
    schema += `    replacement BOOLEAN,\n`;
    schema += `    count INTEGER\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS deck_entries (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    deck_id INTEGER REFERENCES decks(id) ON DELETE CASCADE,\n`;
    schema += `    entry_order INTEGER NOT NULL,\n`;
    schema += `    type TEXT,\n`;
    schema += `    content TEXT,\n`;
    schema += `    list_items TEXT,\n`;
    schema += `    table_caption TEXT,\n`;
    schema += `    table_col_labels TEXT,\n`;
    schema += `    table_col_styles TEXT,\n`;
    schema += `    table_rows TEXT,\n`;
    schema += `    footnotes TEXT,\n`;
    schema += `    raw_json TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS deck_other_sources (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    deck_id INTEGER REFERENCES decks(id) ON DELETE CASCADE,\n`;
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
    fs.writeFileSync(path.join(scriptDir, 'deck_schema_postgres.sql'), postgresSchema, 'utf-8');
    console.log('Generated deck_schema_postgres.sql in the root directory.');

    // Generate and write SQLite schema
    const sqliteSchema = generateSqliteSchema();
    fs.writeFileSync(path.join(scriptDir, 'deck_schema_sqlite.sql'), sqliteSchema, 'utf-8');
    console.log('Generated deck_schema_sqlite.sql in the root directory.');
}

main();
