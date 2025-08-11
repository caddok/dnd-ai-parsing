const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'raw-data', 'languages.json');
const outputFile = path.join(__dirname, 'postgres', 'with-markers', 'insert_languages_postgres.sql');

// Ensure output directory exists
fs.mkdirSync(path.dirname(outputFile), { recursive: true });

/**
 * Escapes single quotes in a string for SQL compatibility.
 * @param {any} value The value to escape.
 * @returns {string} The escaped string or NULL.
 */
function escapeSql(value) {
    if (value === null || typeof value === 'undefined') {
        return 'NULL';
    }
    const str = String(value);
    return `'${str.replace(/'/g, "''")}'`;
}

/**
 * Processes entry arrays into a simple text description.
 * @param {any} entries The entry object or array.
 * @returns {string}
 */
function processEntries(entries) {
    if (!entries) return '';
    return entries.map(entry => {
        if (typeof entry === 'string') return entry;
        let content = '';
        if (entry.name) content += `${entry.name}\n`;
        if (entry.entries) content += processEntries(entry.entries);
        return content;
    }).join('\n');
}


try {
    const rawData = fs.readFileSync(inputFile, 'utf8');
    const jsonData = JSON.parse(rawData);

    const allSqlStatements = [];

    // Process language scripts first as languages may reference them
    if (jsonData.languageScript) {
        allSqlStatements.push('-- Inserting Language Scripts');
        const scriptInserts = jsonData.languageScript.map(script => {
            const scriptName = escapeSql(script.name);
            return `INSERT INTO language_scripts (name) VALUES (${scriptName}) ON CONFLICT (name) DO NOTHING;`;
        });
        allSqlStatements.push(...scriptInserts);
    }

    allSqlStatements.push('\n-- Inserting Languages');
    // Process languages
    if (jsonData.language) {
        // A Set to track unique language/source combinations to avoid duplicates
        const processedLanguages = new Set();

        const languageInserts = jsonData.language.map(lang => {
            const uniqueKey = `${lang.name}|${lang.source}`;
            if (processedLanguages.has(uniqueKey)) {
                return null; // Skip duplicate
            }
            processedLanguages.add(uniqueKey);

            const name = escapeSql(lang.name);
            const sourceIdQuery = lang.source ? `(SELECT id FROM sources WHERE name = ${escapeSql(lang.source)})` : 'NULL';
            const page = lang.page || 'NULL';
            const type = escapeSql(lang.type);
            const typicalSpeakers = lang.typicalSpeakers ? `ARRAY[${lang.typicalSpeakers.map(escapeSql).join(', ')}]` : 'NULL';
            const scriptIdQuery = lang.script ? `(SELECT id FROM language_scripts WHERE name = ${escapeSql(lang.script)})` : 'NULL';
            const description = escapeSql(processEntries(lang.entries));

            return `INSERT INTO languages (name, source_id, page, type, typical_speakers, script_id, description) VALUES (${name}, ${sourceIdQuery}, ${page}, ${type}, ${typicalSpeakers}, ${scriptIdQuery}, ${description});`;
        }).filter(Boolean); // Filter out nulls from skipped duplicates

        allSqlStatements.push(...languageInserts);
    }

    const finalSql = allSqlStatements.join('\n');

    fs.writeFileSync(outputFile, finalSql);
    console.log(`Successfully generated SQL inserts at: ${outputFile}`);

} catch (error) {
    console.error('Error generating SQL inserts:', error);
}
