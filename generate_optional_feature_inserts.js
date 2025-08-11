
const fs = require('fs');
const path = require('path');

function cleanText(text) {
    if (typeof text !== 'string') {
        return text;
    }
    text = text.replace(/{@\w+\s*([^|]+?)(?:\|[^}]+?)?}/g, '$1');
    text = text.replace(/'/g, "''");
    return text;
}

function parseOptionalFeatureEntries(optionalFeatureId, entries, dbType) {
    const insertStatements = [];
    if (!entries || !Array.isArray(entries)) {
        return insertStatements;
    }

    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const entryType = entry.type || 'string';
        let name = 'NULL';
        let content = null;
        let listItems = 'NULL';
        let tableCaption = 'NULL';
        let tableColLabels = 'NULL';
        let tableColStyles = 'NULL';
        let tableRows = 'NULL';
        let rawJson = 'NULL';

        if (entryType === 'string') {
            content = cleanText(entry);
        } else if (entryType === 'list') {
            listItems = JSON.stringify(entry.items || []);
            listItems = listItems.replace(/'/g, "''");
        } else if (entryType === 'table') {
            tableCaption = entry.caption ? cleanText(entry.caption) : 'NULL';
            tableColLabels = entry.colLabels ? JSON.stringify(entry.colLabels).replace(/'/g, "''") : 'NULL';
            tableColStyles = entry.colStyles ? JSON.stringify(entry.colStyles).replace(/'/g, "''") : 'NULL';
            tableRows = entry.rows ? JSON.stringify(entry.rows).replace(/'/g, "''") : 'NULL';
        } else if (entryType === 'entries' || entryType === 'section' || entryType === 'inset' || entryType === 'insetReadaloud') {
            name = entry.name ? cleanText(entry.name) : 'NULL';
            if (entry.entries) {
                rawJson = JSON.stringify(entry.entries);
                rawJson = rawJson.replace(/'/g, "''");
            }
        } else {
            rawJson = JSON.stringify(entry);
            rawJson = rawJson.replace(/'/g, "''");
        }

        if (dbType === 'postgres') {
            insertStatements.push(
                `INSERT INTO optional_feature_entries (optional_feature_id, entry_order, type, name, content, list_items, table_caption, table_col_labels, table_col_styles, table_rows, raw_json) VALUES (` +
                `${optionalFeatureId}, ${i}, '${entryType}', ${name !== 'NULL' ? `'${name}'` : 'NULL'}, ${content !== null ? `'${content}'` : 'NULL'}, ` +
                `${listItems !== 'NULL' ? `'${listItems}'::jsonb` : 'NULL'}, ${tableCaption !== 'NULL' ? `'${tableCaption}'` : 'NULL'}, ` +
                `${tableColLabels !== 'NULL' ? `'${tableColLabels}'::jsonb` : 'NULL'}, ${tableColStyles !== 'NULL' ? `'${tableColStyles}'::jsonb` : 'NULL'}, ` +
                `${tableRows !== 'NULL' ? `'${tableRows}'::jsonb` : 'NULL'}, ${rawJson !== 'NULL' ? `'${rawJson}'::jsonb` : 'NULL'});`
            );
        } else if (dbType === 'sqlite') {
            insertStatements.push(
                `INSERT INTO optional_feature_entries (optional_feature_id, entry_order, type, name, content, list_items, table_caption, table_col_labels, table_col_styles, table_rows, raw_json) VALUES (` +
                `${optionalFeatureId}, ${i}, '${entryType}', ${name !== 'NULL' ? `'${name}'` : 'NULL'}, ${content !== null ? `'${content}'` : 'NULL'}, ` +
                `${listItems !== 'NULL' ? `'${listItems}'` : 'NULL'}, ${tableCaption !== 'NULL' ? `'${tableCaption}'` : 'NULL'}, ` +
                `${tableColLabels !== 'NULL' ? `'${tableColLabels}'` : 'NULL'}, ${tableColStyles !== 'NULL' ? `'${tableColStyles}'` : 'NULL'}, ` +
                `${tableRows !== 'NULL' ? `'${tableRows}'` : 'NULL'}, ${rawJson !== 'NULL' ? `'${rawJson}'` : 'NULL'});`
            );
        }
    }
    return insertStatements;
}

function generateInserts(jsonData, dbType, existingOptionalFeatureNames, existingSourceNames) {
    const inserts = {
        sources: [],
        optional_features: [],
        optional_feature_types: [],
        optional_feature_prerequisites: [],
        optional_feature_consumes: [],
        optional_feature_additional_spells: [],
        optional_feature_senses: [],
        optional_feature_skill_proficiencies: [],
        optional_feature_resistances: [],
        optional_feature_entries: [],
        optional_feature_other_sources: []
    };

    const sourcesMap = {};
    let currentSourceId = 1;
    for (const sourceName of existingSourceNames) {
        sourcesMap[sourceName] = currentSourceId++;
    }

    for (const optionalFeatureData of jsonData) {
        const name = cleanText(optionalFeatureData.name);

        if (existingOptionalFeatureNames.has(name)) {
            continue;
        }

        const source = cleanText(optionalFeatureData.source);
        if (!(source in sourcesMap)) {
            sourcesMap[source] = currentSourceId++;
            if (!existingSourceNames.has(source)) {
                inserts.sources.push(`INSERT INTO sources (name) VALUES ('${source}');`);
            }
        }
        const sourceId = sourcesMap[source];

        const page = optionalFeatureData.page || 'NULL';
        const srd = !!optionalFeatureData.srd;
        const basicRules = !!optionalFeatureData.basicRules;
        const isClassFeatureVariant = !!optionalFeatureData.isClassFeatureVariant;
        const hasFluffImages = !!optionalFeatureData.hasFluffImages;

        if (dbType === 'postgres') {
            inserts.optional_features.push(
                `INSERT INTO optional_features (name, source_id, page, srd, basic_rules, is_class_feature_variant, has_fluff_images) VALUES (` +
                `'${name}', ${sourceId}, ${page}, ${srd}, ${basicRules}, ${isClassFeatureVariant}, ${hasFluffImages});`
            );
        } else if (dbType === 'sqlite') {
            inserts.optional_features.push(
                `INSERT INTO optional_features (name, source_id, page, srd, basic_rules, is_class_feature_variant, has_fluff_images) VALUES (` +
                `'${name}', ${sourceId}, ${page}, ${srd ? 1 : 0}, ${basicRules ? 1 : 0}, ${isClassFeatureVariant ? 1 : 0}, ${hasFluffImages ? 1 : 0});`
            );
        }

        const optionalFeatureIdPlaceholder = inserts.optional_features.length; // Pseudo-ID

        // Optional Feature Types
        if (optionalFeatureData.featureType && Array.isArray(optionalFeatureData.featureType)) {
            for (const typeName of optionalFeatureData.featureType) {
                inserts.optional_feature_types.push(
                    `INSERT INTO optional_feature_types (optional_feature_id, type_name) VALUES (${optionalFeatureIdPlaceholder}, '${cleanText(typeName)}');`
                );
            }
        }

        // Optional Feature Prerequisites
        if (optionalFeatureData.prerequisite && Array.isArray(optionalFeatureData.prerequisite)) {
            for (const prereq of optionalFeatureData.prerequisite) {
                const prereqJson = JSON.stringify(prereq).replace(/'/g, "''");
                if (dbType === 'postgres') {
                    inserts.optional_feature_prerequisites.push(
                        `INSERT INTO optional_feature_prerequisites (optional_feature_id, prerequisite_json) VALUES (${optionalFeatureIdPlaceholder}, '${prereqJson}'::jsonb);`
                    );
                } else if (dbType === 'sqlite') {
                    inserts.optional_feature_prerequisites.push(
                        `INSERT INTO optional_feature_prerequisites (optional_feature_id, prerequisite_json) VALUES (${optionalFeatureIdPlaceholder}, '${prereqJson}');`
                    );
                }
            }
        }

        // Optional Feature Consumes
        if (optionalFeatureData.consumes) {
            const consumeName = optionalFeatureData.consumes.name ? cleanText(optionalFeatureData.consumes.name) : 'NULL';
            const amount = optionalFeatureData.consumes.amount || 'NULL';
            inserts.optional_feature_consumes.push(
                `INSERT INTO optional_feature_consumes (optional_feature_id, consume_name, amount) VALUES (${optionalFeatureIdPlaceholder}, '${consumeName}', ${amount});`
            );
        }

        // Optional Feature Additional Spells
        if (optionalFeatureData.additionalSpells && Array.isArray(optionalFeatureData.additionalSpells)) {
            for (const spellData of optionalFeatureData.additionalSpells) {
                const spellDataJson = JSON.stringify(spellData).replace(/'/g, "''");
                if (dbType === 'postgres') {
                    inserts.optional_feature_additional_spells.push(
                        `INSERT INTO optional_feature_additional_spells (optional_feature_id, spell_data_json) VALUES (${optionalFeatureIdPlaceholder}, '${spellDataJson}'::jsonb);`
                    );
                } else if (dbType === 'sqlite') {
                    inserts.optional_feature_additional_spells.push(
                        `INSERT INTO optional_feature_additional_spells (optional_feature_id, spell_data_json) VALUES (${optionalFeatureIdPlaceholder}, '${spellDataJson}');`
                    );
                }
            }
        }

        // Optional Feature Senses
        if (optionalFeatureData.senses && Array.isArray(optionalFeatureData.senses)) {
            for (const sense of optionalFeatureData.senses) {
                for (const senseType in sense) {
                    if (sense.hasOwnProperty(senseType)) {
                        const range = sense[senseType];
                        inserts.optional_feature_senses.push(
                            `INSERT INTO optional_feature_senses (optional_feature_id, sense_type, range) VALUES (${optionalFeatureIdPlaceholder}, '${cleanText(senseType)}', ${range});`
                        );
                    }
                }
            }
        }

        // Optional Feature Skill Proficiencies
        if (optionalFeatureData.skillProficiencies && Array.isArray(optionalFeatureData.skillProficiencies)) {
            for (const skillProf of optionalFeatureData.skillProficiencies) {
                for (const skillName in skillProf) {
                    if (skillProf.hasOwnProperty(skillName)) {
                        const value = !!skillProf[skillName];
                        if (dbType === 'postgres') {
                            inserts.optional_feature_skill_proficiencies.push(
                                `INSERT INTO optional_feature_skill_proficiencies (optional_feature_id, skill_name, value) VALUES (${optionalFeatureIdPlaceholder}, '${cleanText(skillName)}', ${value});`
                            );
                        } else if (dbType === 'sqlite') {
                            inserts.optional_feature_skill_proficiencies.push(
                                `INSERT INTO optional_feature_skill_proficiencies (optional_feature_id, skill_name, value) VALUES (${optionalFeatureIdPlaceholder}, '${cleanText(skillName)}', ${value ? 1 : 0});`
                            );
                        }
                    }
                }
            }
        }

        // Optional Feature Resistances
        if (optionalFeatureData.resist && Array.isArray(optionalFeatureData.resist)) {
            for (const resistType of optionalFeatureData.resist) {
                inserts.optional_feature_resistances.push(
                    `INSERT INTO optional_feature_resistances (optional_feature_id, damage_type) VALUES (${optionalFeatureIdPlaceholder}, '${cleanText(resistType)}');`
                );
            }
        }

        // Optional Feature Entries
        if (optionalFeatureData.entries) {
            inserts.optional_feature_entries.push(...parseOptionalFeatureEntries(optionalFeatureIdPlaceholder, optionalFeatureData.entries, dbType));
        }

        // Optional Feature Other Sources
        if (optionalFeatureData.otherSources && Array.isArray(optionalFeatureData.otherSources)) {
            for (const otherSource of optionalFeatureData.otherSources) {
                const osName = otherSource.source ? cleanText(otherSource.source) : 'NULL';
                const osPage = otherSource.page || 'NULL';
                inserts.optional_feature_other_sources.push(
                    `INSERT INTO optional_feature_other_sources (optional_feature_id, source_name, page) VALUES (${optionalFeatureIdPlaceholder}, '${osName}', ${osPage});`
                );
            }
        }
    }

    return inserts;
}

function getExistingNames(filePath, type) {
    const existingNames = new Set();
    const existingSourceNames = new Set();
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const mainRegex = new RegExp(`INSERT INTO ${type}s \(name,.*?VALUES \('(.*?)',`, 'g');
        const sourceRegex = /INSERT INTO sources \(name\) VALUES \('(.*?)'\);/g;

        let match;
        while ((match = mainRegex.exec(content)) !== null) {
            existingNames.add(match[1].replace(/''/g, "'"));
        }
        while ((match = sourceRegex.exec(content)) !== null) {
            existingSourceNames.add(match[1].replace(/''/g, "'"));
        }
    }
    return { existingNames, existingSourceNames };
}

async function main() {
    const scriptDir = 'C:\\Projects\\dnd-class-data';
    const rawDataDir = path.join(scriptDir, 'raw-data');
    const postgresInsertsPath = path.join(scriptDir, 'postgres', 'insert_optional_features_postgres.sql');
    const sqliteInsertsPath = path.join(scriptDir, 'sqlite', 'insert_optional_features_sqlite.sql');

    const optionalFeaturesJsonPath = path.join(rawDataDir, 'optionalfeatures.json');

    let allOptionalFeaturesData = { optionalfeature: [] };

    try {
        const data = JSON.parse(fs.readFileSync(optionalFeaturesJsonPath, 'utf-8'));
        allOptionalFeaturesData.optionalfeature.push(...(data.optionalfeature || []));
    } catch (error) {
        console.error(`Error reading optionalfeatures.json: ${error.message}`);
        return;
    }

    const { existingNames: pgExistingOptionalFeatureNames, existingSourceNames: pgExistingSourceNames } = getExistingNames(postgresInsertsPath, 'optional_feature');
    const { existingNames: sqliteExistingOptionalFeatureNames, existingSourceNames: sqliteExistingSourceNames } = getExistingNames(sqliteInsertsPath, 'optional_feature');

    const pgInserts = generateInserts(allOptionalFeaturesData.optionalfeature, 'postgres', pgExistingOptionalFeatureNames, pgExistingSourceNames);
    const sqliteInserts = generateInserts(allOptionalFeaturesData.optionalfeature, 'sqlite', sqliteExistingOptionalFeatureNames, sqliteExistingSourceNames);

    // Write PostgreSQL inserts
    let pgOutput = `-- Source Inserts\n` + pgInserts.sources.join('\n') + '\n\n';
    for (const table in pgInserts) {
        if (table !== 'sources') {
            pgOutput += `-- ${table.replace(/_/g, ' ').replace(/optional feature/g, 'Optional Feature')} Inserts\n` + pgInserts[table].join('\n') + '\n\n';
        }
    }
    fs.writeFileSync(path.join(scriptDir, 'insert_optional_features_postgres.sql'), pgOutput, 'utf-8');
    console.log('Generated insert_optional_features_postgres.sql in the root directory.');

    // Write SQLite inserts
    let sqliteOutput = `-- Source Inserts\n` + sqliteInserts.sources.join('\n') + '\n\n';
    for (const table in sqliteInserts) {
        if (table !== 'sources') {
            sqliteOutput += `-- ${table.replace(/_/g, ' ').replace(/optional feature/g, 'Optional Feature')} Inserts\n` + sqliteInserts[table].join('\n') + '\n\n';
        }
    }
    fs.writeFileSync(path.join(scriptDir, 'insert_optional_features_sqlite.sql'), sqliteOutput, 'utf-8');
    console.log('Generated insert_optional_features_sqlite.sql in the root directory.');
}

main();
