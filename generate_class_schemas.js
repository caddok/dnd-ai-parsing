
const fs = require('fs');
const path = require('path');

function generatePostgresSchema() {
    let schema = `-- PostgreSQL DDL for Classes (Normalized)\n\n`;

    schema += `CREATE TABLE IF NOT EXISTS sources (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    name VARCHAR(255) UNIQUE NOT NULL\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS classes (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    name VARCHAR(255) UNIQUE NOT NULL,\n`;
    schema += `    source_id INTEGER REFERENCES sources(id),\n`;
    schema += `    page INTEGER,\n`;
    schema += `    hd_number INTEGER,\n`;
    schema += `    hd_faces INTEGER,\n`;
    schema += `    spellcasting_ability VARCHAR(50),\n`;
    schema += `    caster_progression VARCHAR(255),\n`;
    schema += `    prepared_spells VARCHAR(255),\n`;
    schema += `    prepared_spells_change VARCHAR(255),\n`;
    schema += `    has_fluff BOOLEAN,\n`;
    schema += `    has_fluff_images BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS class_other_sources (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,\n`;
    schema += `    source_name VARCHAR(255),\n`;
    schema += `    page INTEGER\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS class_proficiencies (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,\n`;
    schema += `    proficiency_name VARCHAR(255)\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS class_cantrip_progression (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,\n`;
    schema += `    level INTEGER,\n`;
    schema += `    cantrips_known INTEGER\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS class_optional_feature_progression (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,\n`;
    schema += `    name VARCHAR(255),\n`;
    schema += `    feature_type JSONB,\n`;
    schema += `    progression JSONB\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS class_starting_proficiencies_armor (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,\n`;
    schema += `    armor_type VARCHAR(255)\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS class_starting_proficiencies_weapons (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,\n`;
    schema += `    weapon_type VARCHAR(255),\n`;
    schema += `    optional BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS class_starting_proficiencies_tools (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,\n`;
    schema += `    tool_name VARCHAR(255)\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS class_starting_proficiencies_tool_proficiencies (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,\n`;
    schema += `    tool_name VARCHAR(255),\n`;
    schema += `    value BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS class_starting_proficiencies_skills (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,\n`;
    schema += `    choose_from JSONB,\n`;
    schema += `    count INTEGER\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS class_starting_equipment_default (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,\n`;
    schema += `    description TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS class_starting_equipment_default_data (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,\n`;
    schema += `    data_json JSONB\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS class_multiclassing_requirements (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,\n`;
    schema += `    ability VARCHAR(50),\n`;
    schema += `    score INTEGER\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS class_multiclassing_proficiencies_gained_armor (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,\n`;
    schema += `    armor_type VARCHAR(255)\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS class_multiclassing_proficiencies_gained_tools (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,\n`;
    schema += `    tool_name VARCHAR(255)\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS class_multiclassing_proficiencies_gained_tool_proficiencies (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,\n`;
    schema += `    tool_name VARCHAR(255),\n`;
    schema += `    value BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS class_table_groups (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,\n`;
    schema += `    title VARCHAR(255),\n`;
    schema += `    col_labels JSONB,\n`;
    schema += `    rows JSONB,\n`;
    schema += `    rows_spell_progression JSONB\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS subclasses (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    name VARCHAR(255) UNIQUE NOT NULL,\n`;
    schema += `    short_name VARCHAR(255),\n`;
    schema += `    source_id INTEGER REFERENCES sources(id),\n`;
    schema += `    class_name VARCHAR(255),\n`;
    schema += `    class_source VARCHAR(255),\n`;
    schema += `    page INTEGER,\n`;
    schema += `    has_fluff BOOLEAN,\n`;
    schema += `    has_fluff_images BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS subclass_other_sources (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    subclass_id INTEGER REFERENCES subclasses(id) ON DELETE CASCADE,\n`;
    schema += `    source_name VARCHAR(255),\n`;
    schema += `    page INTEGER\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS subclass_additional_spells (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    subclass_id INTEGER REFERENCES subclasses(id) ON DELETE CASCADE,\n`;
    schema += `    prepared_spells_json JSONB\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS subclass_features (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    subclass_id INTEGER REFERENCES subclasses(id) ON DELETE CASCADE,\n`;
    schema += `    name VARCHAR(255),\n`;
    schema += `    source VARCHAR(255),\n`;
    schema += `    level INTEGER\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS features (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    name VARCHAR(255) NOT NULL,\n`;
    schema += `    source_id INTEGER REFERENCES sources(id),\n`;
    schema += `    page INTEGER,\n`;
    schema += `    class_name VARCHAR(255),\n`;
    schema += `    class_source VARCHAR(255),\n`;
    schema += `    subclass_short_name VARCHAR(255),\n`;
    schema += `    subclass_source VARCHAR(255),\n`;
    schema += `    level INTEGER,\n`;
    schema += `    header INTEGER,\n`;
    schema += `    has_fluff BOOLEAN,\n`;
    schema += `    has_fluff_images BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS feature_entries (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    feature_id INTEGER REFERENCES features(id) ON DELETE CASCADE,\n`;
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
    schema += `    raw_json JSONB,\n`;
    schema += `    ref_feature_name VARCHAR(255),\n`;
    schema += `    ref_feature_class VARCHAR(255),\n`;
    schema += `    ref_feature_source VARCHAR(255),\n`;
    schema += `    ref_feature_level INTEGER,\n`;
    schema += `    ref_subclass_feature_name VARCHAR(255),\n`;
    schema += `    ref_subclass_feature_class VARCHAR(255),\n`;
    schema += `    ref_subclass_feature_class_source VARCHAR(255),\n`;
    schema += `    ref_subclass_feature_subclass_short_name VARCHAR(255),\n`;
    schema += `    ref_subclass_feature_subclass_source VARCHAR(255),\n`;
    schema += `    ref_subclass_feature_level INTEGER,\n`;
    schema += `    ability_dc_attributes JSONB,\n`;
    schema += `    ability_attack_mod_attributes JSONB\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS feature_other_sources (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    feature_id INTEGER REFERENCES features(id) ON DELETE CASCADE,\n`;
    schema += `    source_name VARCHAR(255),\n`;
    schema += `    page INTEGER\n`;
    schema += `);

`;

    return schema;
}

function generateSqliteSchema() {
    let schema = `-- SQLite DDL for Classes (Normalized)\n\n`;

    schema += `CREATE TABLE IF NOT EXISTS sources (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    name TEXT UNIQUE NOT NULL\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS classes (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    name TEXT UNIQUE NOT NULL,\n`;
    schema += `    source_id INTEGER REFERENCES sources(id),\n`;
    schema += `    page INTEGER,\n`;
    schema += `    hd_number INTEGER,\n`;
    schema += `    hd_faces INTEGER,\n`;
    schema += `    spellcasting_ability TEXT,\n`;
    schema += `    caster_progression TEXT,\n`;
    schema += `    prepared_spells TEXT,\n`;
    schema += `    prepared_spells_change TEXT,\n`;
    schema += `    has_fluff BOOLEAN,\n`;
    schema += `    has_fluff_images BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS class_other_sources (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,\n`;
    schema += `    source_name TEXT,\n`;
    schema += `    page INTEGER\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS class_proficiencies (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,\n`;
    schema += `    proficiency_name TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS class_cantrip_progression (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,\n`;
    schema += `    level INTEGER,\n`;
    schema += `    cantrips_known INTEGER\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS class_optional_feature_progression (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,\n`;
    schema += `    name TEXT,\n`;
    schema += `    feature_type TEXT,\n`;
    schema += `    progression TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS class_starting_proficiencies_armor (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,\n`;
    schema += `    armor_type TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS class_starting_proficiencies_weapons (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,\n`;
    schema += `    weapon_type TEXT,\n`;
    schema += `    optional BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS class_starting_proficiencies_tools (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,\n`;
    schema += `    tool_name TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS class_starting_proficiencies_tool_proficiencies (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,\n`;
    schema += `    tool_name TEXT,\n`;
    schema += `    value BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS class_starting_proficiencies_skills (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,\n`;
    schema += `    choose_from TEXT,\n`;
    schema += `    count INTEGER\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS class_starting_equipment_default (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,\n`;
    schema += `    description TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS class_starting_equipment_default_data (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,\n`;
    schema += `    data_json TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS class_multiclassing_requirements (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,\n`;
    schema += `    ability TEXT,\n`;
    schema += `    score INTEGER\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS class_multiclassing_proficiencies_gained_armor (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,\n`;
    schema += `    armor_type TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS class_multiclassing_proficiencies_gained_tools (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,\n`;
    schema += `    tool_name TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS class_multiclassing_proficiencies_gained_tool_proficiencies (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,\n`;
    schema += `    tool_name TEXT,\n`;
    schema += `    value BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS class_table_groups (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,\n`;
    schema += `    title TEXT,\n`;
    schema += `    col_labels TEXT,\n`;
    schema += `    rows TEXT,\n`;
    schema += `    rows_spell_progression TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS subclasses (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    name TEXT UNIQUE NOT NULL,\n`;
    schema += `    short_name TEXT,\n`;
    schema += `    source_id INTEGER REFERENCES sources(id),\n`;
    schema += `    class_name TEXT,\n`;
    schema += `    class_source TEXT,\n`;
    schema += `    page INTEGER,\n`;
    schema += `    has_fluff BOOLEAN,\n`;
    schema += `    has_fluff_images BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS subclass_other_sources (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    subclass_id INTEGER REFERENCES subclasses(id) ON DELETE CASCADE,\n`;
    schema += `    source_name TEXT,\n`;
    schema += `    page INTEGER\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS subclass_additional_spells (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    subclass_id INTEGER REFERENCES subclasses(id) ON DELETE CASCADE,\n`;
    schema += `    prepared_spells_json TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS subclass_features (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    subclass_id INTEGER REFERENCES subclasses(id) ON DELETE CASCADE,\n`;
    schema += `    name TEXT,\n`;
    schema += `    source TEXT,\n`;
    schema += `    level INTEGER\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS features (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    name TEXT NOT NULL,\n`;
    schema += `    source_id INTEGER REFERENCES sources(id),\n`;
    schema += `    page INTEGER,\n`;
    schema += `    class_name TEXT,\n`;
    schema += `    class_source TEXT,\n`;
    schema += `    subclass_short_name TEXT,\n`;
    schema += `    subclass_source TEXT,\n`;
    schema += `    level INTEGER,\n`;
    schema += `    header INTEGER,\n`;
    schema += `    has_fluff BOOLEAN,\n`;
    schema += `    has_fluff_images BOOLEAN\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS feature_entries (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    feature_id INTEGER REFERENCES features(id) ON DELETE CASCADE,\n`;
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
    schema += `    raw_json TEXT,\n`;
    schema += `    ref_feature_name TEXT,\n`;
    schema += `    ref_feature_class TEXT,\n`;
    schema += `    ref_feature_source TEXT,\n`;
    schema += `    ref_feature_level INTEGER,\n`;
    schema += `    ref_subclass_feature_name TEXT,\n`;
    schema += `    ref_subclass_feature_class TEXT,\n`;
    schema += `    ref_subclass_feature_class_source TEXT,\n`;
    schema += `    ref_subclass_feature_subclass_short_name TEXT,\n`;
    schema += `    ref_subclass_feature_subclass_source TEXT,\n`;
    schema += `    ref_subclass_feature_level INTEGER,\n`;
    schema += `    ability_dc_attributes TEXT,\n`;
    schema += `    ability_attack_mod_attributes TEXT\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS feature_other_sources (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    feature_id INTEGER REFERENCES features(id) ON DELETE CASCADE,\n`;
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
    fs.writeFileSync(path.join(scriptDir, 'class_schema_postgres.sql'), postgresSchema, 'utf-8');
    console.log('Generated class_schema_postgres.sql in the root directory.');

    // Generate and write SQLite schema
    const sqliteSchema = generateSqliteSchema();
    fs.writeFileSync(path.join(scriptDir, 'class_schema_sqlite.sql'), sqliteSchema, 'utf-8');
    console.log('Generated class_schema_sqlite.sql in the root directory.');
}

main();
