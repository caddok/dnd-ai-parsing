
const fs = require('fs');
const path = require('path');

function generatePostgresSchema(sampleData) {
    let schema = ``;

    // Table: sources (assuming it exists or will be created separately)
    // For bestiary, we'll just ensure it's mentioned.
    schema += `CREATE TABLE IF NOT EXISTS sources (\n`;
    schema += `    id SERIAL PRIMARY KEY,\n`;
    schema += `    name VARCHAR(255) UNIQUE NOT NULL\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monsters (\n`;
    schema += `    name VARCHAR(255) UNIQUE NOT NULL,\n`;
    schema += `    source_id INTEGER REFERENCES sources(id),\n`;
    schema += `    page INTEGER,\n`;
    schema += `    size JSONB,\n`;
    schema += `    type JSONB,\n`;
    schema += `    alignment JSONB,\n`;
    schema += `    alignment_prefix VARCHAR(255),\n`;
    schema += `    ac JSONB,\n`;
    schema += `    hp JSONB,\n`;
    schema += `    speed JSONB,\n`;
    schema += `    strength INTEGER,\n`;
    schema += `    dexterity INTEGER,\n`;
    schema += `    constitution INTEGER,\n`;
    schema += `    intelligence INTEGER,\n`;
    schema += `    wisdom INTEGER,\n`;
    schema += `    charisma INTEGER,\n`;
    schema += `    saves JSONB,\n`;
    schema += `    skills JSONB,\n`;
    schema += `    senses JSONB,\n`;
    schema += `    passive_perception INTEGER,\n`;
    schema += `    resistances JSONB,\n`;
    schema += `    immunities JSONB,\n`;
    schema += `    condition_immunities JSONB,\n`;
    schema += `    languages JSONB,\n`;
    schema += `    challenge_rating JSONB,\n`;
    schema += `    spellcasting JSONB,\n`;
    schema += `    traits JSONB,\n`;
    schema += `    actions JSONB,\n`;
    schema += `    reactions JSONB,\n`;
    schema += `    legendary_actions JSONB,\n`;
    schema += `    legendary_group JSONB,\n`;
    schema += `    environments JSONB,\n`;
    schema += `    sound_clip JSONB,\n`;
    schema += `    attached_items JSONB,\n`;
    schema += `    trait_tags JSONB,\n`;
    schema += `    sense_tags JSONB,\n`;
    schema += `    action_tags JSONB,\n`;
    schema += `    language_tags JSONB,\n`;
    schema += `    damage_tags JSONB,\n`;
    schema += `    damage_tags_spell JSONB,\n`;
    schema += `    spellcasting_tags JSONB,\n`;
    schema += `    misc_tags JSONB,\n`;
    schema += `    condition_inflict JSONB,\n`;
    schema += `    condition_inflict_spell JSONB,\n`;
    schema += `    saving_throw_forced JSONB,\n`;
    schema += `    saving_throw_forced_spell JSONB,\n`;
    schema += `    has_token BOOLEAN,\n`;
    schema += `    has_fluff BOOLEAN,\n`;
    schema += `    has_fluff_images BOOLEAN,\n`;
    schema += `    dragon_casting_color VARCHAR(255),\n`;
    schema += `    dragon_age VARCHAR(255),\n`;
    schema += `    variants JSONB,\n`;
    schema += `    other_sources JSONB,\n`;
    schema += `    reprinted_as JSONB,\n`;
    schema += `    is_named_creature BOOLEAN\n`;
    schema += `);
`;

    return schema;
}

function generateSqliteSchema(sampleData) {
    let schema = ``;

    // Table: sources (assuming it exists or will be created separately)
    schema += `CREATE TABLE IF NOT EXISTS sources (\n`;
    schema += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
    schema += `    name TEXT UNIQUE NOT NULL\n`;
    schema += `);

`;

    schema += `CREATE TABLE IF NOT EXISTS monsters (\n`;
    schema += `    name TEXT UNIQUE NOT NULL,\n`;
    schema += `    source_id INTEGER REFERENCES sources(id),\n`;
    schema += `    page INTEGER,\n`;
    schema += `    size TEXT,\n`;
    schema += `    type TEXT,\n`;
    schema += `    alignment TEXT,\n`;
    schema += `    alignment_prefix TEXT,\n`;
    schema += `    ac TEXT,\n`;
    schema += `    hp TEXT,\n`;
    schema += `    speed TEXT,\n`;
    schema += `    strength INTEGER,\n`;
    schema += `    dexterity INTEGER,\n`;
    schema += `    constitution INTEGER,\n`;
    schema += `    intelligence INTEGER,\n`;
    schema += `    wisdom INTEGER,\n`;
    schema += `    charisma INTEGER,\n`;
    schema += `    saves TEXT,\n`;
    schema += `    skills TEXT,\n`;
    schema += `    senses TEXT,\n`;
    schema += `    passive_perception INTEGER,\n`;
    schema += `    resistances TEXT,\n`;
    schema += `    immunities TEXT,\n`;
    schema += `    condition_immunities TEXT,\n`;
    schema += `    languages TEXT,\n`;
    schema += `    challenge_rating TEXT,\n`;
    schema += `    spellcasting TEXT,\n`;
    schema += `    traits TEXT,\n`;
    schema += `    actions TEXT,\n`;
    schema += `    reactions TEXT,\n`;
    schema += `    legendary_actions TEXT,\n`;
    schema += `    legendary_group TEXT,\n`;
    schema += `    environments TEXT,\n`;
    schema += `    sound_clip TEXT,\n`;
    schema += `    attached_items TEXT,\n`;
    schema += `    trait_tags TEXT,\n`;
    schema += `    sense_tags TEXT,\n`;
    schema += `    action_tags TEXT,\n`;
    schema += `    language_tags TEXT,\n`;
    schema += `    damage_tags TEXT,\n`;
    schema += `    damage_tags_spell TEXT,\n`;
    schema += `    spellcasting_tags TEXT,\n`;
    schema += `    misc_tags TEXT,\n`;
    schema += `    condition_inflict TEXT,\n`;
    schema += `    condition_inflict_spell TEXT,\n`;
    schema += `    saving_throw_forced TEXT,\n`;
    schema += `    saving_throw_forced_spell TEXT,\n`;
    schema += `    has_token BOOLEAN,\n`;
    schema += `    has_fluff BOOLEAN,\n`;
    schema += `    has_fluff_images BOOLEAN,\n`;
    schema += `    dragon_casting_color TEXT,\n`;
    schema += `    dragon_age TEXT,\n`;
    schema += `    variants TEXT,\n`;
    schema += `    other_sources TEXT,\n`;
    schema += `    reprinted_as TEXT,\n`;
    schema += `    is_named_creature BOOLEAN\n`;
    schema += `);
`;

    return schema;
}

async function main() {
    const scriptDir = 'C:\\Projects\\dnd-class-data';
    const rawDataDir = path.join(scriptDir, 'raw-data');

    const bestiaryFiles = [
        'bestiary-xge.json',
        'bestiary-vgm.json',
        'bestiary-mtf.json',
        'bestiary-mpmm.json',
        'bestiary-mm.json',
        'bestiary-dmg.json'
    ];

    let allBestiaryData = [];

    for (const file of bestiaryFiles) {
        const filePath = path.join(rawDataDir, file);
        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            allBestiaryData.push(...(data.monster || []));
        } catch (error) {
            console.error(`Error reading ${file}: ${error.message}`);
        }
    }

    // Generate and write PostgreSQL schema
    const postgresSchema = generatePostgresSchema(allBestiaryData);
    fs.writeFileSync(path.join(scriptDir, 'bestiary_schema_postgres.sql'), postgresSchema, 'utf-8');
    console.log('Generated bestiary_schema_postgres.sql in the root directory.');

    // Generate and write SQLite schema
    const sqliteSchema = generateSqliteSchema(allBestiaryData);
    fs.writeFileSync(path.join(scriptDir, 'bestiary_schema_sqlite.sql'), sqliteSchema, 'utf-8');
    console.log('Generated bestiary_schema_sqlite.sql in the root directory.');
}

main();
