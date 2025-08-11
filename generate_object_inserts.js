
const fs = require('fs');
const path = require('path');

function cleanText(text) {
    if (typeof text !== 'string') {
        return text;
    }
    text = text.replace(/{@\w+\s*([^|]+?)(?:|[^}]+?)?}/g, '$1');
    text = text.replace(/'/g, "''");
    return text;
}

function parseObjectEntries(objectId, entries, dbType) {
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
        let imageHrefType = 'NULL';
        let imageHrefPath = 'NULL';
        let imageTitle = 'NULL';
        let imageWidth = 'NULL';
        let imageHeight = 'NULL';
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
        } else if (entry.type === 'image') {
            if (entry.href) {
                imageHrefType = entry.href.type ? cleanText(entry.href.type) : 'NULL';
                imageHrefPath = entry.href.path ? cleanText(entry.href.path) : 'NULL';
            }
            imageTitle = entry.title ? cleanText(entry.title) : 'NULL';
            imageWidth = entry.width || 'NULL';
            imageHeight = entry.height || 'NULL';
        } else {
            rawJson = JSON.stringify(entry);
            rawJson = rawJson.replace(/'/g, "''");
        }

        if (dbType === 'postgres') {
            insertStatements.push(
                `INSERT INTO object_entries (object_id, entry_order, type, name, content, list_items, table_caption, table_col_labels, table_col_styles, table_rows, image_href_type, image_href_path, image_title, image_width, image_height, raw_json) VALUES (` +
                `${objectId}, ${i}, '${entryType}', ${name !== 'NULL' ? "'" + name + "'" : 'NULL'}, ${content !== null ? "'" + content + "'" : 'NULL'}, ` +
                `${listItems !== 'NULL' ? "'" + listItems + "'::jsonb" : 'NULL'}, ${tableCaption !== 'NULL' ? "'" + tableCaption + "'" : 'NULL'}, ` +
                `${tableColLabels !== 'NULL' ? "'" + tableColLabels + "'::jsonb" : 'NULL'}, ${tableColStyles !== 'NULL' ? "'" + tableColStyles + "'::jsonb" : 'NULL'}, ` +
                `${tableRows !== 'NULL' ? "'" + tableRows + "'::jsonb" : 'NULL'}, ${imageHrefType !== 'NULL' ? "'" + imageHrefType + "'" : 'NULL'}, ${imageHrefPath !== 'NULL' ? "'" + imageHrefPath + "'" : 'NULL'}, ` +
                `${imageTitle !== 'NULL' ? "'" + imageTitle + "'" : 'NULL'}, ${imageWidth}, ${imageHeight}, ` +
                `${rawJson !== 'NULL' ? "'" + rawJson + "'::jsonb" : 'NULL'});`
            );
        } else if (dbType === 'sqlite') {
            insertStatements.push(
                `INSERT INTO object_entries (object_id, entry_order, type, name, content, list_items, table_caption, table_col_labels, table_col_styles, table_rows, image_href_type, image_href_path, image_title, image_width, image_height, raw_json) VALUES (` +
                `${objectId}, ${i}, '${entryType}', ${name !== 'NULL' ? "'" + name + "'" : 'NULL'}, ${content !== null ? "'" + content + "'" : 'NULL'}, ` +
                `${listItems !== 'NULL' ? "'" + listItems + "'" : 'NULL'}, ${tableCaption !== 'NULL' ? "'" + tableCaption + "'" : 'NULL'}, ` +
                `${tableColLabels !== 'NULL' ? "'" + tableColLabels + "'" : 'NULL'}, ${tableColStyles !== 'NULL' ? "'" + tableColStyles + "'" : 'NULL'}, ` +
                `${tableRows !== 'NULL' ? "'" + tableRows + "'" : 'NULL'}, ${imageHrefType !== 'NULL' ? "'" + imageHrefType + "'" : 'NULL'}, ${imageHrefPath !== 'NULL' ? "'" + imageHrefPath + "'" : 'NULL'}, ` +
                `${imageTitle !== 'NULL' ? "'" + imageTitle + "'" : 'NULL'}, ${imageWidth}, ${imageHeight}, ` +
                `${rawJson !== 'NULL' ? "'" + rawJson + "'" : 'NULL'});`
            );
        }
    }
    return insertStatements;
}

function parseObjectActionEntries(objectId, actionEntries, dbType) {
    const insertStatements = [];
    if (!actionEntries || !Array.isArray(actionEntries)) {
        return insertStatements;
    }

    for (let i = 0; i < actionEntries.length; i++) {
        const actionEntry = actionEntries[i];
        const type = actionEntry.type ? cleanText(actionEntry.type) : 'NULL';
        const name = actionEntry.name ? cleanText(actionEntry.name) : 'NULL';
        const entriesJson = actionEntry.entries ? JSON.stringify(actionEntry.entries).replace(/'/g, "''") : 'NULL';

        if (dbType === 'postgres') {
            insertStatements.push(
                `INSERT INTO object_action_entries (object_id, entry_order, type, name, entries_json) VALUES (` +
                `${objectId}, ${i}, ${type !== 'NULL' ? "'" + type + "'" : 'NULL'}, ${name !== 'NULL' ? "'" + name + "'" : 'NULL'}, ` +
                `${entriesJson !== 'NULL' ? "'" + entriesJson + "'::jsonb" : 'NULL'});`
            );
        } else if (dbType === 'sqlite') {
            insertStatements.push(
                `INSERT INTO object_action_entries (object_id, entry_order, type, name, entries_json) VALUES (` +
                `${objectId}, ${i}, ${type !== 'NULL' ? "'" + type + "'" : 'NULL'}, ${name !== 'NULL' ? "'" + name + "'" : 'NULL'}, ` +
                `${entriesJson !== 'NULL' ? "'" + entriesJson + "'" : 'NULL'});`
            );
        }
    }
    return insertStatements;
}

function generateInserts(jsonData, dbType, existingObjectNames, existingSourceNames) {
    const inserts = {
        sources: [],
        objects: [],
        object_sizes: [],
        object_immunities: [],
        object_resistances: [],
        object_vulnerabilities: [],
        object_entries: [],
        object_action_entries: []
    };

    const sourcesMap = {};
    let currentSourceId = 1;
    for (const sourceName of existingSourceNames) {
        sourcesMap[sourceName] = currentSourceId++;
    }

    for (const objectData of jsonData) {
        const name = cleanText(objectData.name);

        if (existingObjectNames.has(name)) {
            continue;
        }

        const source = cleanText(objectData.source);
        if (!(source in sourcesMap)) {
            sourcesMap[source] = currentSourceId++;
            if (!existingSourceNames.has(source)) {
                inserts.sources.push(`INSERT INTO sources (name) VALUES ('${source}');`);
            }
        }
        const sourceId = sourcesMap[source];

        const page = objectData.page || 'NULL';
        const objectType = objectData.objectType ? cleanText(objectData.objectType) : 'NULL';
        const ac = objectData.ac && typeof objectData.ac === 'number' ? objectData.ac : 'NULL';
        const acSpecial = objectData.ac && typeof objectData.ac === 'object' && objectData.ac.special ? cleanText(objectData.ac.special) : 'NULL';
        const hp = objectData.hp && typeof objectData.hp === 'number' ? objectData.hp : 'NULL';
        const hpFormula = objectData.hp && objectData.hp.formula ? cleanText(objectData.hp.formula) : 'NULL';
        const hpSpecial = objectData.hp && objectData.hp.special ? cleanText(objectData.hp.special) : 'NULL';

        const strength = objectData.str || 'NULL';
        const dexterity = objectData.dex || 'NULL';
        const constitution = objectData.con || 'NULL';
        const intelligence = objectData.int || 'NULL';
        const wisdom = objectData.wis || 'NULL';
        const charisma = objectData.cha || 'NULL';

        const speed = objectData.speed || {};
        const speedWalk = speed.walk || 'NULL';
        const speedBurrow = speed.burrow || 'NULL';
        const speedClimb = speed.climb || 'NULL';
        const speedFly = speed.fly && speed.fly.number ? speed.fly.number : 'NULL';
        const speedFlyCondition = speed.fly && speed.fly.condition ? cleanText(speed.fly.condition) : 'NULL';
        const speedSwim = speed.swim || 'NULL';

        const hasToken = !!objectData.hasToken;
        const tokenCredit = objectData.tokenCredit ? cleanText(objectData.tokenCredit) : 'NULL';
        const hasFluffImages = !!objectData.hasFluffImages;
        const isNpc = !!objectData.isNpc;

        if (dbType === 'postgres') {
            inserts.objects.push(
                `INSERT INTO objects (name, source_id, page, object_type, ac, ac_special, hp, hp_formula, hp_special, strength, dexterity, constitution, intelligence, wisdom, charisma, speed_walk, speed_burrow, speed_climb, speed_fly, speed_fly_condition, speed_swim, has_token, token_credit, has_fluff_images, is_npc) VALUES (` +
                `'${name}', ${sourceId}, ${page}, ${objectType !== 'NULL' ? "'" + objectType + "'" : 'NULL'}, ${ac}, ${acSpecial !== 'NULL' ? "'" + acSpecial + "'" : 'NULL'}, ` +
                `${hp}, ${hpFormula !== 'NULL' ? "'" + hpFormula + "'" : 'NULL'}, ${hpSpecial !== 'NULL' ? "'" + hpSpecial + "'" : 'NULL'}, ` +
                `${strength}, ${dexterity}, ${constitution}, ${intelligence}, ${wisdom}, ${charisma}, ` +
                `${speedWalk}, ${speedBurrow}, ${speedClimb}, ${speedFly}, ${speedFlyCondition !== 'NULL' ? "'" + speedFlyCondition + "'" : 'NULL'}, ${speedSwim}, ` +
                `${hasToken}, ${tokenCredit !== 'NULL' ? "'" + tokenCredit + "'" : 'NULL'}, ${hasFluffImages}, ${isNpc});`
            );
        } else if (dbType === 'sqlite') {
            inserts.objects.push(
                `INSERT INTO objects (name, source_id, page, object_type, ac, ac_special, hp, hp_formula, hp_special, strength, dexterity, constitution, intelligence, wisdom, charisma, speed_walk, speed_burrow, speed_climb, speed_fly, speed_fly_condition, speed_swim, has_token, token_credit, has_fluff_images, is_npc) VALUES (` +
                `'${name}', ${sourceId}, ${page}, ${objectType !== 'NULL' ? "'" + objectType + "'" : 'NULL'}, ${ac}, ${acSpecial !== 'NULL' ? "'" + acSpecial + "'" : 'NULL'}, ` +
                `${hp}, ${hpFormula !== 'NULL' ? "'" + hpFormula + "'" : 'NULL'}, ${hpSpecial !== 'NULL' ? "'" + hpSpecial + "'" : 'NULL'}, ` +
                `${strength}, ${dexterity}, ${constitution}, ${intelligence}, ${wisdom}, ${charisma}, ` +
                `${speedWalk}, ${speedBurrow}, ${speedClimb}, ${speedFly}, ${speedFlyCondition !== 'NULL' ? "'" + speedFlyCondition + "'" : 'NULL'}, ${speedSwim}, ` +
                `${hasToken ? 1 : 0}, ${tokenCredit !== 'NULL' ? "'" + tokenCredit + "'" : 'NULL'}, ${hasFluffImages ? 1 : 0}, ${isNpc ? 1 : 0});`
            );
        }

        const objectIdPlaceholder = inserts.objects.length; // Pseudo-ID

        // Object Sizes
        if (objectData.size && Array.isArray(objectData.size)) {
            for (const sizeChar of objectData.size) {
                inserts.object_sizes.push(
                    `INSERT INTO object_sizes (object_id, size_char) VALUES (${objectIdPlaceholder}, '${cleanText(sizeChar)}');`
                );
            }
        }

        // Object Immunities
        if (objectData.immune && Array.isArray(objectData.immune)) {
            for (const immuneEntry of objectData.immune) {
                let damageType = 'NULL';
                let specialNote = 'NULL';

                if (typeof immuneEntry === 'string') {
                    damageType = cleanText(immuneEntry);
                } else if (typeof immuneEntry === 'object' && immuneEntry !== null) {
                    damageType = immuneEntry.immune && immuneEntry.immune.length > 0 ? cleanText(immuneEntry.immune.join(', ')) : 'NULL';
                    specialNote = immuneEntry.special ? cleanText(immuneEntry.special) : 'NULL';
                }
                inserts.object_immunities.push(
                    `INSERT INTO object_immunities (object_id, damage_type, special_note) VALUES (` +
                    `${objectIdPlaceholder}, ${damageType !== 'NULL' ? "'" + damageType + "'" : 'NULL'}, ${specialNote !== 'NULL' ? "'" + specialNote + "'" : 'NULL'});`
                );
            }
        }

        // Object Resistances
        if (objectData.resist && Array.isArray(objectData.resist)) {
            for (const resistType of objectData.resist) {
                inserts.object_resistances.push(
                    `INSERT INTO object_resistances (object_id, damage_type) VALUES (${objectIdPlaceholder}, '${cleanText(resistType)}');`
                );
            }
        }

        // Object Vulnerabilities
        if (objectData.vulnerable && Array.isArray(objectData.vulnerable)) {
            for (const vulnerableType of objectData.vulnerable) {
                inserts.object_vulnerabilities.push(
                    `INSERT INTO object_vulnerabilities (object_id, damage_type) VALUES (${objectIdPlaceholder}, '${cleanText(vulnerableType)}');`
                );
            }
        }

        // Object Entries
        if (objectData.entries) {
            inserts.object_entries.push(...parseObjectEntries(objectIdPlaceholder, objectData.entries, dbType));
        }

        // Object Action Entries
        if (objectData.actionEntries) {
            inserts.object_action_entries.push(...parseObjectActionEntries(objectIdPlaceholder, objectData.actionEntries, dbType));
        }
    }

    return inserts;
}

function getExistingNames(filePath, type) {
    const existingNames = new Set();
    const existingSourceNames = new Set();
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const mainRegex = new RegExp(`INSERT INTO ${type}s \(name,.*?VALUES 
cies\('(.*?)',`, 'g');
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
    const postgresInsertsPath = path.join(scriptDir, 'postgres', 'insert_objects_postgres.sql');
    const sqliteInsertsPath = path.join(scriptDir, 'sqlite', 'insert_objects_sqlite.sql');

    const objectsJsonPath = path.join(rawDataDir, 'objects.json');

    let allObjectsData = { object: [] };

    try {
        const data = JSON.parse(fs.readFileSync(objectsJsonPath, 'utf-8'));
        allObjectsData.object.push(...(data.object || []));
    } catch (error) {
        console.error(`Error reading objects.json: ${error.message}`);
        return;
    }

    const { existingNames: pgExistingObjectNames, existingSourceNames: pgExistingSourceNames } = getExistingNames(postgresInsertsPath, 'object');
    const { existingNames: sqliteExistingObjectNames, existingSourceNames: sqliteExistingSourceNames } = getExistingNames(sqliteInsertsPath, 'object');

    const pgInserts = generateInserts(allObjectsData.object, 'postgres', pgExistingObjectNames, pgExistingSourceNames);
    const sqliteInserts = generateInserts(allObjectsData.object, 'sqlite', sqliteExistingObjectNames, sqliteExistingSourceNames);

    // Write PostgreSQL inserts
    let pgOutput = `-- Source Inserts\n` + pgInserts.sources.join('\n') + '\n\n';
    for (const table in pgInserts) {
        if (table !== 'sources') {
            pgOutput += `-- ${table.replace(/_/g, ' ').replace(/object/g, 'Object')} Inserts\n` + pgInserts[table].join('\n') + '\n\n';
        }
    }
    fs.writeFileSync(path.join(scriptDir, 'insert_objects_postgres.sql'), pgOutput, 'utf-8');
    console.log('Generated insert_objects_postgres.sql in the root directory.');

    // Write SQLite inserts
    let sqliteOutput = `-- Source Inserts\n` + sqliteInserts.sources.join('\n') + '\n\n';
    for (const table in sqliteInserts) {
        if (table !== 'sources') {
            sqliteOutput += `-- ${table.replace(/_/g, ' ').replace(/object/g, 'Object')} Inserts\n` + sqliteInserts[table].join('\n') + '\n\n';
        }
    }
    fs.writeFileSync(path.join(scriptDir, 'insert_objects_sqlite.sql'), sqliteOutput, 'utf-8');
    console.log('Generated insert_objects_sqlite.sql in the root directory.');
}

main();
