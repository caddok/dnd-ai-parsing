
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

function parseDeityEntries(deityId, entries, dbType) {
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
        let footnotes = 'NULL';
        let imageHrefType = 'NULL';
        let imageHrefPath = 'NULL';
        let imageCredit = 'NULL';
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
            footnotes = entry.footnotes ? JSON.stringify(entry.footnotes).replace(/'/g, "''") : 'NULL';
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
            imageCredit = entry.credit ? cleanText(entry.credit) : 'NULL';
        } else {
            rawJson = JSON.stringify(entry);
            rawJson = rawJson.replace(/'/g, "''");
        }

        if (dbType === 'postgres') {
            insertStatements.push(
                `INSERT INTO deity_entries (deity_id, entry_order, type, name, content, list_items, table_caption, table_col_labels, table_col_styles, table_rows, footnotes, image_href_type, image_href_path, image_credit, raw_json) VALUES (` +
                `${deityId}, ${i}, '${entryType}', ${name !== 'NULL' ? "'${name}'" : 'NULL'}, ${content !== null ? "'${content}'" : 'NULL'}, ` +
                `${listItems !== 'NULL' ? "'${listItems}'::jsonb" : 'NULL'}, ${tableCaption !== 'NULL' ? "'${tableCaption}'" : 'NULL'}, ` +
                `${tableColLabels !== 'NULL' ? "'${tableColLabels}'::jsonb" : 'NULL'}, ${tableColStyles !== 'NULL' ? "'${tableColStyles}'::jsonb" : 'NULL'}, ` +
                `${tableRows !== 'NULL' ? "'${tableRows}'::jsonb" : 'NULL'}, ${footnotes !== 'NULL' ? "'${footnotes}'::jsonb" : 'NULL'}, ` +
                `${imageHrefType !== 'NULL' ? "'${imageHrefType}'" : 'NULL'}, ${imageHrefPath !== 'NULL' ? "'${imageHrefPath}'" : 'NULL'}, ` +
                `${imageCredit !== 'NULL' ? "'${imageCredit}'" : 'NULL'}, ${rawJson !== 'NULL' ? "'${rawJson}'::jsonb" : 'NULL'});`
            );
        } else if (dbType === 'sqlite') {
            insertStatements.push(
                `INSERT INTO deity_entries (deity_id, entry_order, type, name, content, list_items, table_caption, table_col_labels, table_col_styles, table_rows, footnotes, image_href_type, image_href_path, image_credit, raw_json) VALUES (` +
                `${deityId}, ${i}, '${entryType}', ${name !== 'NULL' ? "'${name}'" : 'NULL'}, ${content !== null ? "'${content}'" : 'NULL'}, ` +
                `${listItems !== 'NULL' ? "'${listItems}'" : 'NULL'}, ${tableCaption !== 'NULL' ? "'${tableCaption}'" : 'NULL'}, ` +
                `${tableColLabels !== 'NULL' ? "'${tableColLabels}'" : 'NULL'}, ${tableColStyles !== 'NULL' ? "'${tableColStyles}'" : 'NULL'}, ` +
                `${tableRows !== 'NULL' ? "'${tableRows}'" : 'NULL'}, ${footnotes !== 'NULL' ? "'${footnotes}'" : 'NULL'}, ` +
                `${imageHrefType !== 'NULL' ? "'${imageHrefType}'" : 'NULL'}, ${imageHrefPath !== 'NULL' ? "'${imageHrefPath}'" : 'NULL'}, ` +
                `${imageCredit !== 'NULL' ? "'${imageCredit}'" : 'NULL'}, ${rawJson !== 'NULL' ? "'${rawJson}'" : 'NULL'});`
            );
        }
    }
    return insertStatements;
}

function generateInserts(jsonData, dbType, existingDeityNames, existingSourceNames) {
    const inserts = {
        sources: [],
        deities: [],
        deity_alt_names: [],
        deity_alignments: [],
        deity_domains: [],
        deity_entries: []
    };

    const sourcesMap = {};
    let currentSourceId = 1;
    for (const sourceName of existingSourceNames) {
        sourcesMap[sourceName] = currentSourceId++;
    }

    for (const deityData of jsonData) {
        const name = cleanText(deityData.name);

        if (existingDeityNames.has(name)) {
            continue;
        }

        const source = cleanText(deityData.source);
        if (!(source in sourcesMap)) {
            sourcesMap[source] = currentSourceId++;
            if (!existingSourceNames.has(source)) {
                inserts.sources.push(`INSERT INTO sources (name) VALUES ('${source}');`);
            }
        }
        const sourceId = sourcesMap[source];

        const page = deityData.page || 'NULL';
        const pantheon = deityData.pantheon ? cleanText(deityData.pantheon) : 'NULL';
        const title = deityData.title ? cleanText(deityData.title) : 'NULL';
        const category = deityData.category ? cleanText(deityData.category) : 'NULL';
        const province = deityData.province ? cleanText(deityData.province) : 'NULL';
        const symbol = deityData.symbol ? cleanText(deityData.symbol) : 'NULL';
        const piety = !!deityData.piety;
        const reprintAlias = deityData.reprintAlias ? cleanText(deityData.reprintAlias) : 'NULL';
        const customExtensionOf = deityData.customExtensionOf ? cleanText(deityData.customExtensionOf) : 'NULL';
        const symbolImgType = deityData.symbolImg && deityData.symbolImg.type ? cleanText(deityData.symbolImg.type) : 'NULL';
        const symbolImgPath = deityData.symbolImg && deityData.symbolImg.href && deityData.symbolImg.href.path ? cleanText(deityData.symbolImg.href.path) : 'NULL';
        const symbolImgCredit = deityData.symbolImg && deityData.symbolImg.credit ? cleanText(deityData.symbolImg.credit) : 'NULL';

        if (dbType === 'postgres') {
            inserts.deities.push(
                `INSERT INTO deities (name, source_id, page, pantheon, title, category, province, symbol, piety, reprint_alias, custom_extension_of, symbol_img_type, symbol_img_path, symbol_img_credit) VALUES (` +
                `'${name}', ${sourceId}, ${page}, ${pantheon !== 'NULL' ? "'${pantheon}'" : 'NULL'}, ${title !== 'NULL' ? "'${title}'" : 'NULL'}, ` +
                `${category !== 'NULL' ? "'${category}'" : 'NULL'}, ${province !== 'NULL' ? "'${province}'" : 'NULL'}, ${symbol !== 'NULL' ? "'${symbol}'" : 'NULL'}, ` +
                `${piety}, ${reprintAlias !== 'NULL' ? "'${reprintAlias}'" : 'NULL'}, ${customExtensionOf !== 'NULL' ? "'${customExtensionOf}'" : 'NULL'}, ` +
                `${symbolImgType !== 'NULL' ? "'${symbolImgType}'" : 'NULL'}, ${symbolImgPath !== 'NULL' ? "'${symbolImgPath}'" : 'NULL'}, ` +
                `${symbolImgCredit !== 'NULL' ? "'${symbolImgCredit}'" : 'NULL'});`
            );
        } else if (dbType === 'sqlite') {
            inserts.deities.push(
                `INSERT INTO deities (name, source_id, page, pantheon, title, category, province, symbol, piety, reprint_alias, custom_extension_of, symbol_img_type, symbol_img_path, symbol_img_credit) VALUES (` +
                `'${name}', ${sourceId}, ${page}, ${pantheon !== 'NULL' ? "'${pantheon}'" : 'NULL'}, ${title !== 'NULL' ? "'${title}'" : 'NULL'}, ` +
                `${category !== 'NULL' ? "'${category}'" : 'NULL'}, ${province !== 'NULL' ? "'${province}'" : 'NULL'}, ${symbol !== 'NULL' ? "'${symbol}'" : 'NULL'}, ` +
                `${piety ? 1 : 0}, ${reprintAlias !== 'NULL' ? "'${reprintAlias}'" : 'NULL'}, ${customExtensionOf !== 'NULL' ? "'${customExtensionOf}'" : 'NULL'}, ` +
                `${symbolImgType !== 'NULL' ? "'${symbolImgType}'" : 'NULL'}, ${symbolImgPath !== 'NULL' ? "'${symbolImgPath}'" : 'NULL'}, ` +
                `${symbolImgCredit !== 'NULL' ? "'${symbolImgCredit}'" : 'NULL'});`
            );
        }

        const deityIdPlaceholder = inserts.deities.length; // Pseudo-ID

        // Alt Names
        if (deityData.altNames && Array.isArray(deityData.altNames)) {
            for (const altName of deityData.altNames) {
                inserts.deity_alt_names.push(
                    `INSERT INTO deity_alt_names (deity_id, alt_name) VALUES (${deityIdPlaceholder}, '${cleanText(altName)}');`
                );
            }
        }

        // Alignments
        if (deityData.alignment && Array.isArray(deityData.alignment)) {
            for (const alignmentChar of deityData.alignment) {
                inserts.deity_alignments.push(
                    `INSERT INTO deity_alignments (deity_id, alignment_char) VALUES (${deityIdPlaceholder}, '${cleanText(alignmentChar)}');`
                );
            }
        }

        // Domains
        if (deityData.domains && Array.isArray(deityData.domains)) {
            for (const domainName of deityData.domains) {
                inserts.deity_domains.push(
                    `INSERT INTO deity_domains (deity_id, domain_name) VALUES (${deityIdPlaceholder}, '${cleanText(domainName)}');`
                );
            }
        }

        // Entries
        if (deityData.entries) {
            inserts.deity_entries.push(...parseDeityEntries(deityIdPlaceholder, deityData.entries, dbType));
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
cies ('(.*?)\\',`, 'g');
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
    const postgresInsertsPath = path.join(scriptDir, 'postgres', 'insert_deities_postgres.sql');
    const sqliteInsertsPath = path.join(scriptDir, 'sqlite', 'insert_deities_sqlite.sql');

    const deitiesJsonPath = path.join(rawDataDir, 'deities.json');

    let allDeitiesData = { deity: [] };

    try {
        const data = JSON.parse(fs.readFileSync(deitiesJsonPath, 'utf-8'));
        allDeitiesData.deity.push(...(data.deity || []));
    } catch (error) {
        console.error(`Error reading deities.json: ${error.message}`);
        return;
    }

    const { existingNames: pgExistingDeityNames, existingSourceNames: pgExistingSourceNames } = getExistingNames(postgresInsertsPath, 'deity');
    const { existingNames: sqliteExistingDeityNames, existingSourceNames: sqliteExistingSourceNames } = getExistingNames(sqliteInsertsPath, 'deity');

    const pgInserts = generateInserts(allDeitiesData.deity, 'postgres', pgExistingDeityNames, pgExistingSourceNames);
    const sqliteInserts = generateInserts(allDeitiesData.deity, 'sqlite', sqliteExistingDeityNames, sqliteExistingSourceNames);

    // Write PostgreSQL inserts
    let pgOutput = `-- Source Inserts\n` + pgInserts.sources.join('\n') + '\n\n';
    for (const table in pgInserts) {
        if (table !== 'sources') {
            pgOutput += `-- ${table.replace(/_/g, ' ').replace(/deity/g, 'Deity')} Inserts\n` + pgInserts[table].join('\n') + '\n\n';
        }
    }
    fs.writeFileSync(path.join(scriptDir, 'insert_deities_postgres.sql'), pgOutput, 'utf-8');
    console.log('Generated insert_deities_postgres.sql in the root directory.');

    // Write SQLite inserts
    let sqliteOutput = `-- Source Inserts\n` + sqliteInserts.sources.join('\n') + '\n\n';
    for (const table in sqliteInserts) {
        if (table !== 'sources') {
            sqliteOutput += `-- ${table.replace(/_/g, ' ').replace(/deity/g, 'Deity')} Inserts\n` + sqliteInserts[table].join('\n') + '\n\n';
        }
    }
    fs.writeFileSync(path.join(scriptDir, 'insert_deities_sqlite.sql'), sqliteOutput, 'utf-8');
    console.log('Generated insert_deities_sqlite.sql in the root directory.');
}

main();
