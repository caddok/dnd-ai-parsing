const fs = require('fs');
const path = require('path');

function cleanText(text) {
    if (typeof text !== 'string') {
        return text;
    }
    return String(text).replace(/'/g, "''");
}

function parseEntries(parentId, entries, dbType, tableName, parentIdColumnName) {
    const insertStatements = [];
    if (!entries || !Array.isArray(entries)) {
        return insertStatements;
    }

    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const entryType = entry.type ? `'${cleanText(entry.type)}'` : 'NULL';
        let content = 'NULL';
        let listItems = 'NULL';
        if (dbType === 'postgres') {
            listItems = 'NULL::jsonb';
        }
        let tableCaption = 'NULL';
        let tableColLabels = 'NULL';
        if (dbType === 'postgres') {
            tableColLabels = 'NULL::jsonb';
        }
        let tableRows = 'NULL';
        if (dbType === 'postgres') {
            tableRows = 'NULL::jsonb';
        }
        let name = entry.name ? `'${cleanText(entry.name)}'` : 'NULL';
        let rawJson = 'NULL';
        if (dbType === 'postgres') {
            rawJson = `'${cleanText(JSON.stringify(entry))}'::jsonb`;
        } else {
            rawJson = `'${cleanText(JSON.stringify(entry))}'`;
        }

        if (typeof entry === 'string') {
            content = `'${cleanText(entry)}'`;
        } else if (entry.type === 'list') {
            if (entry.items) {
                if (dbType === 'postgres') {
                    listItems = `'${cleanText(JSON.stringify(entry.items))}'::jsonb`;
                } else {
                    listItems = `'${cleanText(JSON.stringify(entry.items))}'`;
                }
            }
        } else if (entry.type === 'table') {
            tableCaption = entry.caption ? `'${cleanText(entry.caption)}'` : 'NULL';
            if (entry.colLabels) {
                if (dbType === 'postgres') {
                    tableColLabels = `'${cleanText(JSON.stringify(entry.colLabels))}'::jsonb`;
                } else {
                    tableColLabels = `'${cleanText(JSON.stringify(entry.colLabels))}'`;
                }
            }
            if (entry.rows) {
                if (dbType === 'postgres') {
                    tableRows = `'${cleanText(JSON.stringify(entry.rows))}'::jsonb`;
                } else {
                    tableRows = `'${cleanText(JSON.stringify(entry.rows))}'`;
                }
            }
        } else if (entry.entries) {
            content = entry.entries.map(e => typeof e === 'string' ? cleanText(e) : '').filter(Boolean).join('\n');
            content = content ? `'${content}'` : 'NULL';
        }

        insertStatements.push(
            `INSERT INTO ${tableName} (${parentIdColumnName}, entry_order, type, name, content, list_items, table_caption, table_col_labels, table_rows, raw_json) VALUES (` +
            `${parentId}, ${i}, ${entryType}, ${name}, ${content}, ` +
            `${listItems}, ${tableCaption}, ` +
            `${tableColLabels}, ${tableRows}, ${rawJson});`
        );
    }
    return insertStatements;
}

function generateInserts(jsonData, dbType, existingConditionNames, existingDiseaseNames) {
    const inserts = {
        conditions: [],
        diseases: [],
        condition_entries: [],
        disease_entries: [],
        condition_other_sources: [],
        disease_other_sources: []
    };

    // Process Conditions
    if (jsonData.condition && Array.isArray(jsonData.condition)) {
        for (const conditionData of jsonData.condition) {
            const name = cleanText(conditionData.name);

            if (existingConditionNames.has(name)) {
                continue;
            }

            const source = cleanText(conditionData.source);
            const sourceIdSubquery = `(SELECT id FROM sources WHERE name ILIKE '${source}' LIMIT 1)`;

            const page = conditionData.page || 'NULL';
            const srd = !!conditionData.srd;
            const basicRules = !!conditionData.basicRules;
            const hasFluffImages = !!conditionData.hasFluffImages;

            if (dbType === 'postgres') {
                inserts.conditions.push(
                    `DO $CONDITION_INSERT_BLOCK$\nDECLARE\n    condition_id_var INTEGER;\nBEGIN\n    INSERT INTO conditions (name, source_id, page, srd, basic_rules, has_fluff_images) VALUES (` +
                    `'${name}', ${sourceIdSubquery}, ${page}, ${srd}, ${basicRules}, ${hasFluffImages}) RETURNING id INTO condition_id_var;\n`
                );
            } else {
                inserts.conditions.push(
                    `INSERT INTO conditions (name, source_id, page, srd, basic_rules, has_fluff_images) VALUES (` +
                    `'${name}', ${sourceIdSubquery}, ${page}, ${srd ? 1 : 0}, ${basicRules ? 1 : 0}, ${hasFluffImages ? 1 : 0});`
                );
            }

            const conditionIdPlaceholder = dbType === 'postgres' ? 'condition_id_var' : `(SELECT id FROM conditions WHERE name = '${name}')`;

            // Condition Entries
            if (conditionData.entries) {
                inserts.conditions.push(...parseEntries(conditionIdPlaceholder, conditionData.entries, dbType, 'condition_entries', 'condition_id'));
            }

            // Condition Other Sources
            if (conditionData.otherSources && Array.isArray(conditionData.otherSources)) {
                for (const otherSource of conditionData.otherSources) {
                    const osName = cleanText(otherSource.source);
                    const osPage = otherSource.page || 'NULL';
                    inserts.conditions.push(
                        `INSERT INTO condition_other_sources (condition_id, source_name, page) VALUES (${conditionIdPlaceholder}, '${osName}', ${osPage});\n`
                    );
                }
            }
            if (dbType === 'postgres') {
                inserts.conditions.push(`END $CONDITION_INSERT_BLOCK$;\n`);
            }
        }
    }

    // Process Diseases
    if (jsonData.disease && Array.isArray(jsonData.disease)) {
        for (const diseaseData of jsonData.disease) {
            const name = cleanText(diseaseData.name);

            if (existingDiseaseNames.has(name)) {
                continue;
            }

            const source = cleanText(diseaseData.source);
            const sourceIdSubquery = `(SELECT id FROM sources WHERE name ILIKE '${source}' LIMIT 1)`;

            const page = diseaseData.page || 'NULL';

            if (dbType === 'postgres') {
                inserts.diseases.push(
                    `DO $DISEASE_INSERT_BLOCK$\nDECLARE\n    disease_id_var INTEGER;\nBEGIN\n    INSERT INTO diseases (name, source_id, page) VALUES (` +
                    `'${name}', ${sourceIdSubquery}, ${page}) RETURNING id INTO disease_id_var;\n`
                );
            } else {
                inserts.diseases.push(
                    `INSERT INTO diseases (name, source_id, page) VALUES (` +
                    `'${name}', ${sourceIdSubquery}, ${page});`
                );
            }

            const diseaseIdPlaceholder = dbType === 'postgres' ? 'disease_id_var' : `(SELECT id FROM diseases WHERE name = '${name}')`;

            // Disease Entries
            if (diseaseData.entries) {
                inserts.diseases.push(...parseEntries(diseaseIdPlaceholder, diseaseData.entries, dbType, 'disease_entries', 'disease_id'));
            }

            // Disease Other Sources
            if (diseaseData.otherSources && Array.isArray(diseaseData.otherSources)) {
                for (const otherSource of diseaseData.otherSources) {
                    const osName = cleanText(otherSource.source);
                    const osPage = otherSource.page || 'NULL';
                    inserts.diseases.push(
                        `INSERT INTO disease_other_sources (disease_id, source_name, page) VALUES (${diseaseIdPlaceholder}, '${osName}', ${osPage});\n`
                    );
                }
            }
            if (dbType === 'postgres') {
                inserts.diseases.push(`END $DISEASE_INSERT_BLOCK$;\n`);
            }
        }
    }

    return inserts;
}

function getExistingNames(filePath, type) {
    const existingNames = new Set();
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const regex = new RegExp(`INSERT INTO ${type}s \(name,.*\) VALUES \('([^']+)'`, 'g');
        let match;
        while ((match = regex.exec(content)) !== null) {
            existingNames.add(match[1].replace(/''/g, "'"));
        }
    }
    return existingNames;
}

async function main() {
    const scriptDir = 'C:\\Projects\\dnd-class-data';
    const rawDataDir = path.join(scriptDir, 'raw-data');
    const postgresInsertsPath = path.join(scriptDir, 'postgres', 'insert_conditions_diseases_postgres.sql');
    const sqliteInsertsPath = path.join(scriptDir, 'sqlite', 'insert_conditions_diseases_sqlite.sql');

    const conditionsDiseasesJsonPath = path.join(rawDataDir, 'conditionsdiseases.json');

    let allData = {};

    try {
        allData = JSON.parse(fs.readFileSync(conditionsDiseasesJsonPath, 'utf-8'));
    } catch (error) {
        console.error(`Error reading conditionsdiseases.json: ${error.message}`);
        return;
    }

    const pgExistingConditionNames = getExistingNames(postgresInsertsPath, 'condition');
    const pgExistingDiseaseNames = getExistingNames(postgresInsertsPath, 'disease');

    const sqliteExistingConditionNames = getExistingNames(sqliteInsertsPath, 'condition');
    const sqliteExistingDiseaseNames = getExistingNames(sqliteInsertsPath, 'disease');

    const pgInserts = generateInserts(allData, 'postgres', pgExistingConditionNames, pgExistingDiseaseNames);
    const sqliteInserts = generateInserts(allData, 'sqlite', sqliteExistingConditionNames, sqliteExistingDiseaseNames);

    // Write PostgreSQL inserts
    let pgOutput = ''
    for (const table in pgInserts) {
        if (pgInserts[table].length > 0) {
            pgOutput += `-- ${table.replace(/_/g, ' ').replace(/conditions/g, 'Conditions').replace(/diseases/g, 'Diseases')} Inserts\n` + pgInserts[table].join('\n') + '\n\n';
        }
    }
    fs.writeFileSync(path.join(scriptDir, 'insert_conditions_diseases_postgres.sql'), pgOutput, 'utf-8');
    console.log('Generated insert_conditions_diseases_postgres.sql in the root directory.');

    // Write SQLite inserts
    let sqliteOutput = ''
    for (const table in sqliteInserts) {
        if (sqliteInserts[table].length > 0) {
            sqliteOutput += `-- ${table.replace(/_/g, ' ').replace(/conditions/g, 'Conditions').replace(/diseases/g, 'Diseases')} Inserts\n` + sqliteInserts[table].join('\n') + '\n\n';
        }
    }
    fs.writeFileSync(path.join(scriptDir, 'insert_conditions_diseases_sqlite.sql'), sqliteOutput, 'utf-8');
    console.log('Generated insert_conditions_diseases_sqlite.sql in the root directory.');
}

main();