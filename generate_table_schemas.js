
const fs = require('fs');
const path = require('path');

function generatePostgresSchema() {
    let schema = `-- PostgreSQL DDL for Tables (Normalized)\n\n`;

    schema += `CREATE TABLE IF NOT EXISTS sources (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    name VARCHAR(255) UNIQUE NOT NULL\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS tables (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    name VARCHAR(255) UNIQUE NOT NULL,\n`;
    schema += `    source_id INTEGER REFERENCES sources(id),\n`;
    schema += `    page INTEGER,\n`;
    schema += `    caption TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS table_column_labels (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    table_id INTEGER REFERENCES tables(id) ON DELETE CASCADE,\n`;
    schema += `    label_order INTEGER NOT NULL,\n`;
    schema += `    label_text TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS table_column_styles (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    table_id INTEGER REFERENCES tables(id) ON DELETE CASCADE,\n`;
    schema += `    style_order INTEGER NOT NULL,\n`;
    schema += `    style_text TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS table_rows (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    table_id INTEGER REFERENCES tables(id) ON DELETE CASCADE,\n`;
    schema += `    row_order INTEGER NOT NULL,\n`;
    schema += `    row_data JSONB\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS table_footnotes (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    table_id INTEGER REFERENCES tables(id) ON DELETE CASCADE,\n`;
    schema += `    footnote_order INTEGER NOT NULL,\n`;
    schema += `    footnote_text TEXT\n`;
    schema += `);

`;

    return schema;
}

function generateSqliteSchema() {
    let schema = `-- SQLite DDL for Tables (Normalized)\n\n`;

    schema += `CREATE TABLE IF NOT EXISTS sources (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    name TEXT UNIQUE NOT NULL\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS tables (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    name TEXT UNIQUE NOT NULL,\n`;
    schema += `    source_id INTEGER REFERENCES sources(id),\n`;
    schema += `    page INTEGER,\n`;
    schema += `    caption TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS table_column_labels (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    table_id INTEGER REFERENCES tables(id) ON DELETE CASCADE,\n`;
    schema += `    label_order INTEGER NOT NULL,\n`;
    schema += `    label_text TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS table_column_styles (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    table_id INTEGER REFERENCES tables(id) ON DELETE CASCADE,\n`;
    schema += `    style_order INTEGER NOT NULL,\n`;
    schema += `    style_text TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS table_rows (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    table_id INTEGER REFERENCES tables(id) ON DELETE CASCADE,\n`;
    schema += `    row_order INTEGER NOT NULL,\n`;
    schema += `    row_data TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS table_footnotes (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    table_id INTEGER REFERENCES tables(id) ON DELETE CASCADE,\n`;
    schema += `    footnote_order INTEGER NOT NULL,\n`;
    schema += `    footnote_text TEXT\n`;
    schema += `);

`;

    return schema;
}

async function main() {
    const scriptDir = 'C:\\Projects\\dnd-class-data';

    // Generate and write PostgreSQL schema
    const postgresSchema = generatePostgresSchema();
    fs.writeFileSync(path.join(scriptDir, 'table_schema_postgres.sql'), postgresSchema, 'utf-8');
    console.log('Generated table_schema_postgres.sql in the root directory.');

    // Generate and write SQLite schema
    const sqliteSchema = generateSqliteSchema();
    fs.writeFileSync(path.join(scriptDir, 'table_schema_sqlite.sql'), sqliteSchema, 'utf-8');
    console.log('Generated table_schema_sqlite.sql in the root directory.');
}

main();
