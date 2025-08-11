const fs = require('fs');
const path = require('path');

function cleanText(text) {
    if (typeof text !== 'string') {
        return text;
    }
    text = text.replace(/{@\w+\s*([^|]+?)(?:|[^}]+)?}/g, '$1');
    text = text.replace(/'/g, "''");
    return text;
}

function parseFeatEntries(featId, entries, dbType) {
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
                `INSERT INTO feat_entries (feat_id, entry_order, type, name, content, list_items, table_caption, table_col_labels, table_col_styles, table_rows, raw_json) VALUES (` +
                `${featId}, ${i}, '${entryType}', ${name !== 'NULL' ? "'" + name + "'" : 'NULL'}, ${content !== null ? "'" + content + "'" : 'NULL'}, ` +
                `${listItems !== 'NULL' ? "'" + listItems + "'::jsonb" : 'NULL'}, ${tableCaption !== 'NULL' ? "'" + tableCaption + "'" : 'NULL'}, ` +
                `${tableColLabels !== 'NULL' ? "'" + tableColLabels + "'::jsonb" : 'NULL'}, ${tableColStyles !== 'NULL' ? "'" + tableColStyles + "'::jsonb" : 'NULL'}, ` +
                `${tableRows !== 'NULL' ? "'" + tableRows + "'::jsonb" : 'NULL'}, ${rawJson !== 'NULL' ? "'" + rawJson + "'::jsonb" : 'NULL'});`
            );
        } else if (dbType === 'sqlite') {
            insertStatements.push(
                `INSERT INTO feat_entries (feat_id, entry_order, type, name, content, list_items, table_caption, table_col_labels, table_col_styles, table_rows, raw_json) VALUES (` +
                `${featId}, ${i}, '${entryType}', ${name !== 'NULL' ? "'" + name + "'" : 'NULL'}, ${content !== null ? "'" + content + "'" : 'NULL'}, ` +
                `${listItems !== 'NULL' ? "'" + listItems + "'" : 'NULL'}, ${tableCaption !== 'NULL' ? "'" + tableCaption + "'" : 'NULL'}, ` +
                `${tableColLabels !== 'NULL' ? "'" + tableColLabels + "'" : 'NULL'}, ${tableColStyles !== 'NULL' ? "'" + tableColStyles + "'" : 'NULL'}, ` +
                `${tableRows !== 'NULL' ? "'" + tableRows + "'" : 'NULL'}, ${rawJson !== 'NULL' ? "'" + rawJson + "'" : 'NULL'});`
            );
        }
    }
    return insertStatements;
}

function generateInserts(jsonData, dbType, existingFeatNames, existingSourceNames) {
    const inserts = {
        sources: [],
        feats: [],
        feat_prerequisites: [],
        feat_abilities: [],
        feat_tool_proficiencies: [],
        feat_language_proficiencies: [],
        feat_armor_proficiencies: [],
        feat_weapon_proficiencies: [],
        feat_additional_spells: [],
        feat_optional_feature_progression: [],
        feat_resistances: [],
        feat_entries: []
    };

    const sourcesMap = {};
    let currentSourceId = 1;
    for (const sourceName of existingSourceNames) {
        sourcesMap[sourceName] = currentSourceId++;
    }

    for (const featData of jsonData) {
        const name = cleanText(featData.name);

        if (existingFeatNames.has(name)) {
            continue;
        }

        const source = cleanText(featData.source);
        if (!(source in sourcesMap)) {
            sourcesMap[source] = currentSourceId++;
            if (!existingSourceNames.has(source)) {
                inserts.sources.push(`INSERT INTO sources (name) VALUES ('${source}');`);
            }
        }
        const sourceId = sourcesMap[source];

        const page = featData.page || 'NULL';
        const hasFluff = !!featData.hasFluff;
        const hasFluffImages = !!featData.hasFluffImages;

        if (dbType === 'postgres') {
            inserts.feats.push(
                `INSERT INTO feats (name, source_id, page, has_fluff, has_fluff_images) VALUES (` +
                `'${name}', ${sourceId}, ${page}, ${hasFluff}, ${hasFluffImages});`
            );
        } else if (dbType === 'sqlite') {
            inserts.feats.push(
                `INSERT INTO feats (name, source_id, page, has_fluff, has_fluff_images) VALUES (` +
                `'${name}', ${sourceId}, ${page}, ${hasFluff ? 1 : 0}, ${hasFluffImages ? 1 : 0});`
            );
        }

        const featIdPlaceholder = inserts.feats.length; // Pseudo-ID

        // Feat Prerequisites
        if (featData.prerequisite && Array.isArray(featData.prerequisite)) {
            for (const prereq of featData.prerequisite) {
                const prereqJson = JSON.stringify(prereq).replace(/'/g, "''");
                if (dbType === 'postgres') {
                    inserts.feat_prerequisites.push(
                        `INSERT INTO feat_prerequisites (feat_id, prerequisite_json) VALUES (${featIdPlaceholder}, '${prereqJson}'::jsonb);`
                    );
                } else if (dbType === 'sqlite') {
                    inserts.feat_prerequisites.push(
                        `INSERT INTO feat_prerequisites (feat_id, prerequisite_json) VALUES (${featIdPlaceholder}, '${prereqJson}');`
                    );
                }
            }
        }

        // Feat Abilities
        if (featData.ability && Array.isArray(featData.ability)) {
            for (const ability of featData.ability) {
                const abilityJson = JSON.stringify(ability).replace(/'/g, "''");
                if (dbType === 'postgres') {
                    inserts.feat_abilities.push(
                        `INSERT INTO feat_abilities (feat_id, ability_score_json) VALUES (${featIdPlaceholder}, '${abilityJson}'::jsonb);`
                    );
                } else if (dbType === 'sqlite') {
                    inserts.feat_abilities.push(
                        `INSERT INTO feat_abilities (feat_id, ability_score_json) VALUES (${featIdPlaceholder}, '${abilityJson}');`
                    );
                }
            }
        }

        // Feat Tool Proficiencies
        if (featData.toolProficiencies && Array.isArray(featData.toolProficiencies)) {
            for (const toolProf of featData.toolProficiencies) {
                for (const toolName in toolProf) {
                    if (toolProf.hasOwnProperty(toolName)) {
                        const value = !!toolProf[toolName];
                        if (dbType === 'postgres') {
                            inserts.feat_tool_proficiencies.push(
                                `INSERT INTO feat_tool_proficiencies (feat_id, tool_name, value) VALUES (${featIdPlaceholder}, '${cleanText(toolName)}', ${value});`
                            );
                        } else if (dbType === 'sqlite') {
                            inserts.feat_tool_proficiencies.push(
                                `INSERT INTO feat_tool_proficiencies (feat_id, tool_name, value) VALUES (${featIdPlaceholder}, '${cleanText(toolName)}', ${value ? 1 : 0});`
                            );
                        }
                    }
                }
            }
        }

        // Feat Language Proficiencies
        if (featData.languageProficiencies && Array.isArray(featData.languageProficiencies)) {
            for (const langProf of featData.languageProficiencies) {
                for (const langName in langProf) {
                    if (langProf.hasOwnProperty(langName)) {
                        const value = !!langProf[langName];
                        if (dbType === 'postgres') {
                            inserts.feat_language_proficiencies.push(
                                `INSERT INTO feat_language_proficiencies (feat_id, language_name, value) VALUES (${featIdPlaceholder}, '${cleanText(langName)}', ${value});`
                            );
                        } else if (dbType === 'sqlite') {
                            inserts.feat_language_proficiencies.push(
                                `INSERT INTO feat_language_proficiencies (feat_id, language_name, value) VALUES (${featIdPlaceholder}, '${cleanText(langName)}', ${value ? 1 : 0});`
                            );
                        }
                    }
                }
            }
        }

        // Feat Armor Proficiencies
        if (featData.armorProficiencies && Array.isArray(featData.armorProficiencies)) {
            for (const armorProf of featData.armorProficiencies) {
                for (const armorType in armorProf) {
                    if (armorProf.hasOwnProperty(armorType)) {
                        const value = !!armorProf[armorType];
                        if (dbType === 'postgres') {
                            inserts.feat_armor_proficiencies.push(
                                `INSERT INTO feat_armor_proficiencies (feat_id, armor_type, value) VALUES (${featIdPlaceholder}, '${cleanText(armorType)}', ${value});`
                            );
                        } else if (dbType === 'sqlite') {
                            inserts.feat_armor_proficiencies.push(
                                `INSERT INTO feat_armor_proficiencies (feat_id, armor_type, value) VALUES (${featIdPlaceholder}, '${cleanText(armorType)}', ${value ? 1 : 0});`
                            );
                        }
                    }
                }
            }
        }

        // Feat Weapon Proficiencies
        if (featData.weaponProficiencies && Array.isArray(featData.weaponProficiencies)) {
            for (const weaponProf of featData.weaponProficiencies) {
                for (const weaponType in weaponProf) {
                    if (weaponProf.hasOwnProperty(weaponType)) {
                        const value = !!weaponProf[weaponType];
                        if (dbType === 'postgres') {
                            inserts.feat_weapon_proficiencies.push(
                                `INSERT INTO feat_weapon_proficiencies (feat_id, weapon_type, value) VALUES (${featIdPlaceholder}, '${cleanText(weaponType)}', ${value});`
                            );
                        } else if (dbType === 'sqlite') {
                            inserts.feat_weapon_proficiencies.push(
                                `INSERT INTO feat_weapon_proficiencies (feat_id, weapon_type, value) VALUES (${featIdPlaceholder}, '${cleanText(weaponType)}', ${value ? 1 : 0});`
                            );
                        }
                    }
                }
            }
        }

        // Feat Additional Spells
        if (featData.additionalSpells && Array.isArray(featData.additionalSpells)) {
            for (const spellData of featData.additionalSpells) {
                const spellDataJson = JSON.stringify(spellData).replace(/'/g, "''");
                if (dbType === 'postgres') {
                    inserts.feat_additional_spells.push(
                        `INSERT INTO feat_additional_spells (feat_id, spell_data_json) VALUES (${featIdPlaceholder}, '${spellDataJson}'::jsonb);`
                    );
                } else if (dbType === 'sqlite') {
                    inserts.feat_additional_spells.push(
                        `INSERT INTO feat_additional_spells (feat_id, spell_data_json) VALUES (${featIdPlaceholder}, '${spellDataJson}');`
                    );
                }
            }
        }

        // Feat Optional Feature Progression
        if (featData.optionalfeatureProgression && Array.isArray(featData.optionalfeatureProgression)) {
            for (const optFeature of featData.optionalfeatureProgression) {
                const optName = optFeature.name ? cleanText(optFeature.name) : 'NULL';
                const featureTypeJson = optFeature.featureType ? JSON.stringify(optFeature.featureType).replace(/'/g, "''") : 'NULL';
                const progressionJson = optFeature.progression ? JSON.stringify(optFeature.progression).replace(/'/g, "''") : 'NULL';

                if (dbType === 'postgres') {
                    inserts.feat_optional_feature_progression.push(
                        `INSERT INTO feat_optional_feature_progression (feat_id, name, feature_type_json, progression_json) VALUES (` +
                        `${featIdPlaceholder}, ${optName !== 'NULL' ? "'" + optName + "'" : 'NULL'}, ${featureTypeJson !== 'NULL' ? "'" + featureTypeJson + "'::jsonb" : 'NULL'}, ` +
                        `${progressionJson !== 'NULL' ? "'" + progressionJson + "'::jsonb" : 'NULL'});`
                    );
                } else if (dbType === 'sqlite') {
                    inserts.feat_optional_feature_progression.push(
                        `INSERT INTO feat_optional_feature_progression (feat_id, name, feature_type_json, progression_json) VALUES (` +
                        `${featIdPlaceholder}, ${optName !== 'NULL' ? "'" + optName + "'" : 'NULL'}, ${featureTypeJson !== 'NULL' ? "'" + featureTypeJson + "'" : 'NULL'}, ` +
                        `${progressionJson !== 'NULL' ? "'" + progressionJson + "'" : 'NULL'});`
                    );
                }
            }
        }

        // Feat Resistances
        if (featData.resist && Array.isArray(featData.resist)) {
            for (const resistType of featData.resist) {
                inserts.feat_resistances.push(
                    `INSERT INTO feat_resistances (feat_id, damage_type) VALUES (${featIdPlaceholder}, '${cleanText(resistType)}');`
                );
            }
        }

        // Feat Entries
        if (featData.entries) {
            inserts.feat_entries.push(...parseFeatEntries(featIdPlaceholder, featData.entries, dbType));
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
    const postgresInsertsPath = path.join(scriptDir, 'postgres', 'insert_feats_postgres.sql');
    const sqliteInsertsPath = path.join(scriptDir, 'sqlite', 'insert_feats_sqlite.sql');

    const featsJsonPath = path.join(rawDataDir, 'feats.json');

    let allFeatsData = { feat: [] };

    try {
        const data = JSON.parse(fs.readFileSync(featsJsonPath, 'utf-8'));
        allFeatsData.feat.push(...(data.feat || []));
    } catch (error) {
        console.error(`Error reading feats.json: ${error.message}`);
        return;
    }

    const { existingNames: pgExistingFeatNames, existingSourceNames: pgExistingSourceNames } = getExistingNames(postgresInsertsPath, 'feat');
    const { existingNames: sqliteExistingFeatNames, existingSourceNames: sqliteExistingSourceNames } = getExistingNames(sqliteInsertsPath, 'feat');

    const pgInserts = generateInserts(allFeatsData.feat, 'postgres', pgExistingFeatNames, pgExistingSourceNames);
    const sqliteInserts = generateInserts(allFeatsData.feat, 'sqlite', sqliteExistingFeatNames, sqliteExistingSourceNames);

    // Write PostgreSQL inserts
    let pgOutput = `-- Source Inserts\n` + pgInserts.sources.join('\n') + '\n\n';
    for (const table in pgInserts) {
        if (table !== 'sources') {
            pgOutput += `-- ${table.replace(/_/g, ' ').replace(/feat/g, 'Feat')} Inserts\n` + pgInserts[table].join('\n') + '\n\n';
        }
    }
    fs.writeFileSync(path.join(scriptDir, 'insert_feats_postgres.sql'), pgOutput, 'utf-8');
    console.log('Generated insert_feats_postgres.sql in the root directory.');

    // Write SQLite inserts
    let sqliteOutput = `-- Source Inserts\n` + sqliteInserts.sources.join('\n') + '\n\n';
    for (const table in sqliteInserts) {
        if (table !== 'sources') {
            sqliteOutput += `-- ${table.replace(/_/g, ' ').replace(/feat/g, 'Feat')} Inserts\n` + sqliteInserts[table].join('\n') + '\n\n';
        }
    }
    fs.writeFileSync(path.join(scriptDir, 'insert_feats_sqlite.sql'), sqliteOutput, 'utf-8');
    console.log('Generated insert_feats_sqlite.sql in the root directory.');
}

main();