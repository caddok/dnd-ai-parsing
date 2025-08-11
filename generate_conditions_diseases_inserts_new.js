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
            `    INSERT INTO ${tableName} (${parentIdColumnName}, entry_order, type, name, content, list_items, table_caption, table_col_labels, table_rows, raw_json) VALUES (` +
            `${parentId}, ${i}, ${entryType}, ${name}, ${content}, ` +
            `${listItems}, ${tableCaption}, ` +
            `${tableColLabels}, ${tableRows}, ${rawJson});`
        );
    }
    return insertStatements;
}

function generateInserts(jsonData, dbType) {
    const inserts = {
        conditions: [],
        diseases: []
    };

    // Process Conditions
    if (jsonData.condition && Array.isArray(jsonData.condition)) {
        for (const conditionData of jsonData.condition) {
            const name = cleanText(conditionData.name);
            const source = cleanText(conditionData.source);
            const sourceIdSubquery = `(SELECT id FROM sources WHERE name ILIKE '${source}' LIMIT 1)`;

            const page = conditionData.page || 'NULL';
            const srd = !!conditionData.srd;
            const basicRules = !!conditionData.basicRules;
            const hasFluffImages = !!conditionData.hasFluffImages;

            let conditionInserts = [];
            if (dbType === 'postgres') {
                let insertBlock = `DO $CONDITION_INSERT_BLOCK$\nDECLARE\n    condition_id_var INTEGER;\nBEGIN\n`;
                insertBlock += `    INSERT INTO conditions (name, source_id, page, srd, basic_rules, has_fluff_images) VALUES ('${name}', ${sourceIdSubquery}, ${page}, ${srd}, ${basicRules}, ${hasFluffImages}) RETURNING id INTO condition_id_var;
`;
                if (conditionData.entries) {
                    const entryInserts = parseEntries('condition_id_var', conditionData.entries, dbType, 'condition_entries', 'condition_id');
                    insertBlock += entryInserts.join('\n');
                }
                if (conditionData.otherSources && Array.isArray(conditionData.otherSources)) {
                    for (const otherSource of conditionData.otherSources) {
                        const osName = cleanText(otherSource.source);
                        const osPage = otherSource.page || 'NULL';
                        insertBlock += `\n    INSERT INTO condition_other_sources (condition_id, source_name, page) VALUES (condition_id_var, '${osName}', ${osPage});`;
                    }
                }
                insertBlock += `\nEND $CONDITION_INSERT_BLOCK$;`;
                conditionInserts.push(insertBlock);
            } else {
                conditionInserts.push(
                    `INSERT INTO conditions (name, source_id, page, srd, basic_rules, has_fluff_images) VALUES ('${name}', ${sourceIdSubquery}, ${page}, ${srd ? 1 : 0}, ${basicRules ? 1 : 0}, ${hasFluffImages ? 1 : 0});`
                );
                const conditionIdPlaceholder = `(SELECT id FROM conditions WHERE name = '${name}')`;
                if (conditionData.entries) {
                    conditionInserts.push(...parseEntries(conditionIdPlaceholder, conditionData.entries, dbType, 'condition_entries', 'condition_id'));
                }
                if (conditionData.otherSources && Array.isArray(conditionData.otherSources)) {
                    for (const otherSource of conditionData.otherSources) {
                        const osName = cleanText(otherSource.source);
                        const osPage = otherSource.page || 'NULL';
                        conditionInserts.push(
                            `INSERT INTO condition_other_sources (condition_id, source_name, page) VALUES (${conditionIdPlaceholder}, '${osName}', ${osPage});`
                        );
                    }
                }
            }
            inserts.conditions.push(conditionInserts.join('\n'));
        }
    }

    // Process Diseases
    if (jsonData.disease && Array.isArray(jsonData.disease)) {
        for (const diseaseData of jsonData.disease) {
            const name = cleanText(diseaseData.name);
            const source = cleanText(diseaseData.source);
            const sourceIdSubquery = `(SELECT id FROM sources WHERE name ILIKE '${source}' LIMIT 1)`;

            const page = diseaseData.page || 'NULL';

            let diseaseInserts = [];
            if (dbType === 'postgres') {
                let insertBlock = `DO $DISEASE_INSERT_BLOCK$\nDECLARE\n    disease_id_var INTEGER;
BEGIN
`;
                insertBlock += `    INSERT INTO diseases (name, source_id, page) VALUES ('${name}', ${sourceIdSubquery}, ${page}) RETURNING id INTO disease_id_var;
`;
                if (diseaseData.entries) {
                    const entryInserts = parseEntries('disease_id_var', diseaseData.entries, dbType, 'disease_entries', 'disease_id');
                    insertBlock += entryInserts.join('\n');
                }
                if (diseaseData.otherSources && Array.isArray(diseaseData.otherSources)) {
                    for (const otherSource of diseaseData.otherSources) {
                        const osName = cleanText(otherSource.source);
                        const osPage = otherSource.page || 'NULL';
                        insertBlock += `\n    INSERT INTO disease_other_sources (disease_id, source_name, page) VALUES (disease_id_var, '${osName}', ${osPage});`;
                    }
                }
                insertBlock += `\nEND $DISEASE_INSERT_BLOCK$;`;
                diseaseInserts.push(insertBlock);
            } else {
                diseaseInserts.push(
                    `INSERT INTO diseases (name, source_id, page) VALUES ('${name}', ${sourceIdSubquery}, ${page});`
                );
                const diseaseIdPlaceholder = `(SELECT id FROM diseases WHERE name = '${name}')`;
                if (diseaseData.entries) {
                    diseaseInserts.push(...parseEntries(diseaseIdPlaceholder, diseaseData.entries, dbType, 'disease_entries', 'disease_id'));
                }
                if (diseaseData.otherSources && Array.isArray(diseaseData.otherSources)) {
                    for (const otherSource of diseaseData.otherSources) {
                        const osName = cleanText(otherSource.source);
                        const osPage = otherSource.page || 'NULL';
                        diseaseInserts.push(
                            `INSERT INTO disease_other_sources (disease_id, source_name, page) VALUES (${diseaseIdPlaceholder}, '${osName}', ${osPage});`
                        );
                    }
                }
            }
            inserts.diseases.push(diseaseInserts.join('\n'));
        }
    }

    return inserts;
}

async function main() {
    const scriptDir = 'C:\\Projects\\dnd-class-data';
    const rawDataDir = path.join(scriptDir, 'raw-data');
    const postgresInsertsPath = path.join(scriptDir, 'postgres', 'insert_conditions_diseases_postgres_new.sql');
    const sqliteInsertsPath = path.join(scriptDir, 'sqlite', 'insert_conditions_diseases_sqlite_new.sql');

    const conditionsDiseasesJsonPath = path.join(rawDataDir, 'conditionsdiseases.json');

    let allData = {};

    try {
        allData = JSON.parse(fs.readFileSync(conditionsDiseasesJsonPath, 'utf-8'));
    } catch (error) {
        console.error(`Error reading conditionsdiseases.json: ${error.message}`);
        return;
    }

    const pgInserts = generateInserts(allData, 'postgres');
    const sqliteInserts = generateInserts(allData, 'sqlite');

    // Write PostgreSQL inserts
    let pgOutput = ''
    for (const table in pgInserts) {
        if (pgInserts[table].length > 0) {
            pgOutput += `-- ${table.replace(/_/g, ' ').replace(/conditions/g, 'Conditions').replace(/diseases/g, 'Diseases')} Inserts\n` + pgInserts[table].join('\n\n') + '\n\n';
        }
    }
    fs.writeFileSync(postgresInsertsPath, pgOutput, 'utf-8');
    console.log(`Generated ${postgresInsertsPath}`);

    // Write SQLite inserts
    let sqliteOutput = ''
    for (const table in sqliteInserts) {
        if (sqliteInserts[table].length > 0) {
            sqliteOutput += `-- ${table.replace(/_/g, ' ').replace(/conditions/g, 'Conditions').replace(/diseases/g, 'Diseases')} Inserts\n` + sqliteInserts[table].join('\n') + '\n\n';
        }
    }
    fs.writeFileSync(sqliteInsertsPath, sqliteOutput, 'utf-8');
    console.log(`Generated ${sqliteInsertsPath}`);
}

main();