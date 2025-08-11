const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'raw-data', 'backgrounds.json');
const outputFile = path.join(__dirname, 'insert_backgrounds_postgres.sql');

// Ensure output directory exists
fs.mkdirSync(path.dirname(outputFile), { recursive: true });

/**
 * Escapes single quotes in a string for SQL compatibility.
 * @param {any} value The value to escape.
 * @returns {string} The escaped string.
 */
function escapeSql(value) {
    if (value === null || typeof value === 'undefined') {
        return 'NULL';
    }
    const str = String(value).trim();
    return str.replace(/'/g, "''");
}

/**
 * A simple text-based renderer for the 'entries' object.
 * @param {any} entries The entry object or array.
 * @param {number} depth The current recursion depth for indentation.
 * @returns {string}
 */
function processEntries(entries, depth = 0) {
    if (!entries) return '';
    if (typeof entries === 'string') return entries;

    return entries.map(entry => {
        let content = '';
        if (typeof entry === 'string') {
            return entry;
        }
        if (entry.name) {
            content += `
${'#'.repeat(depth + 2)} ${entry.name}
`;
        }
        if (entry.entries) {
            content += processEntries(entry.entries, depth + 1);
        }
        if (entry.type === 'list' && entry.items) {
            content += entry.items.map(item => `* ${item.name} ${item.entry || ''}`).join('\n');
        }
        if (entry.type === 'table' && entry.rows) {
            if (entry.colLabels) {
                content += `| ${entry.colLabels.join(' | ')} |\n`;
                content += `|${entry.colLabels.map(() => '---').join('|')}|\n`;
            }
            content += entry.rows.map(row => `| ${row.join(' | ')} |`).join('\n');
        }
        return content;
    }).join('\n');
}


try {
    const rawData = fs.readFileSync(inputFile, 'utf8');
    const jsonData = JSON.parse(rawData);

    if (!jsonData.background) {
        throw new Error('JSON data does not contain a "background" property.');
    }

    const allSqlStatements = [];

    for (const bg of jsonData.background) {
        if (bg._copy) {
            allSqlStatements.push(`-- ${escapeSql(bg.name)} is a copy of ${escapeSql(bg._copy.name)} and is handled manually or by another script.`);
            continue;
        }

        const backgroundName = escapeSql(bg.name);
        const sourceName = escapeSql(bg.source);
        const page = bg.page || 'NULL';
        const srd = bg.srd || false;
        const basicRules = bg.basicRules || false;
        
        const descriptionEntries = bg.entries.filter(e => e.type !== 'list');
        const description = escapeSql(processEntries(descriptionEntries));
        const startingEquipment = bg.startingEquipment ? "'" + escapeSql(JSON.stringify(bg.startingEquipment)) + "'" : 'NULL';

        const backgroundIdQuery = `(SELECT id FROM backgrounds WHERE name = '${backgroundName}' LIMIT 1)`;

        // Main background insert
        allSqlStatements.push(
            `INSERT INTO backgrounds (name, source_id, page, srd, basic_rules, description, starting_equipment) VALUES ('${backgroundName}', (SELECT id FROM sources WHERE name ILIKE '${sourceName}' LIMIT 1), ${page}, ${srd}, ${basicRules}, '${description}', ${startingEquipment});`
        );

        // Skill Proficiencies
        if (bg.skillProficiencies) {
            for (const prof of bg.skillProficiencies) {
                if (prof.choose) {
                    for (const skill of prof.choose.from) {
                        allSqlStatements.push(`INSERT INTO background_skill_proficiencies (background_id, skill_id, is_choice, choose_count) VALUES (${backgroundIdQuery}, (SELECT id FROM skills WHERE name ILIKE '${escapeSql(skill)}' LIMIT 1), TRUE, ${prof.choose.count || 1});`);
                    }
                } else {
                    for (const skill in prof) {
                        if (prof[skill]) {
                            allSqlStatements.push(`INSERT INTO background_skill_proficiencies (background_id, skill_id, is_choice) VALUES (${backgroundIdQuery}, (SELECT id FROM skills WHERE name ILIKE '${escapeSql(skill)}' LIMIT 1), FALSE);`);
                        }
                    }
                }
            }
        }

        // Language Proficiencies (Corrected)
        if (bg.languageProficiencies) {
            for (const prof of bg.languageProficiencies) {
                if (prof.anyStandard) {
                    allSqlStatements.push(`INSERT INTO background_language_proficiencies (background_id, language_id,any_standard) VALUES (${backgroundIdQuery}, (SELECT id FROM languages WHERE name ILIKE 'any' LIMIT 1), ${prof.anyStandard});`);
                } else if (prof.choose) {
                    for (const lang of prof.choose.from) {
                         allSqlStatements.push(`INSERT INTO background_language_proficiencies (background_id, language_id, is_choice, choose_count) VALUES (${backgroundIdQuery}, (SELECT id FROM languages WHERE name ILIKE '${escapeSql(lang)}' LIMIT 1), TRUE, ${prof.choose.count || 1});`);
                    }
                } else {
                    for (const lang in prof) {
                        if (prof[lang]) {
                            allSqlStatements.push(`INSERT INTO background_language_proficiencies (background_id, language_id, is_choice) VALUES (${backgroundIdQuery}, (SELECT id FROM languages WHERE name ILIKE '${escapeSql(lang)}' LIMIT 1), FALSE);`);
                        }
                    }
                }
            }
        }
        
        // Tool Proficiencies
        if (bg.toolProficiencies) {
            for (const prof of bg.toolProficiencies) {
                if (prof.choose) {
                     for (const tool of prof.choose.from) {
                        allSqlStatements.push(`INSERT INTO background_tool_proficiencies (background_id, tool_id, is_choice, choose_count) VALUES (${backgroundIdQuery}, (SELECT id FROM tools WHERE name ILIKE '${escapeSql(tool)}' LIMIT 1), TRUE, ${prof.choose.count || 1});`);
                    }
                } else {
                    for (const tool in prof) {
                        if (prof[tool]) {
                            allSqlStatements.push(`INSERT INTO background_tool_proficiencies (background_id, tool_id, is_choice) VALUES (${backgroundIdQuery}, (SELECT id FROM tools WHERE name ILIKE '${escapeSql(tool)}' LIMIT 1), FALSE);`);
                        }
                    }
                }
            }
        }
    }

    fs.writeFileSync(outputFile, allSqlStatements.join('\n\n'));
    console.log(`Successfully generated SQL inserts at: ${outputFile}`);

} catch (error) {
    console.error('Error generating SQL inserts:', error);
}
