const fs = require('fs');
const path = require('path');

function cleanText(text) {
    if (typeof text !== 'string') {
        return text;
    }
    // Only escape single quotes, do not remove {@...} tags
    return String(text).replace(/'/g, "''");
}

function parseDeckEntries(deckId, entries, dbType) {
    const insertStatements = [];
    if (!entries || !Array.isArray(entries)) {
        return insertStatements;
    }

    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const entryType = entry.type ? `'${cleanText(entry.type)}'` : 'NULL';
        let content = 'NULL';
        let listItems = 'NULL::jsonb';
        let tableCaption = 'NULL';
        let tableColLabels = 'NULL::jsonb';
        let tableColStyles = 'NULL::jsonb';
        let tableRows = 'NULL::jsonb';
        let footnotes = 'NULL::jsonb';
        const rawJson = `'${cleanText(JSON.stringify(entry))}'::jsonb`;

        if (typeof entry === 'string') {
            content = `'${cleanText(entry)}'`;
        } else if (entry.type === 'list') {
            if (entry.items) {
                listItems = `'${cleanText(JSON.stringify(entry.items))}'::jsonb`;
            }
        } else if (entry.type === 'table') {
            tableCaption = entry.caption ? `'${cleanText(entry.caption)}'` : 'NULL';
            if (entry.colLabels) {
                tableColLabels = `'${cleanText(JSON.stringify(entry.colLabels))}'::jsonb`;
            }
            if (entry.colStyles) {
                tableColStyles = `'${cleanText(JSON.stringify(entry.colStyles))}'::jsonb`;
            }
            if (entry.rows) {
                tableRows = `'${cleanText(JSON.stringify(entry.rows))}'::jsonb`;
            }
            if (entry.footnotes) {
                footnotes = `'${cleanText(JSON.stringify(entry.footnotes))}'::jsonb`;
            }
        } else if (entry.entries) {
            // For entries/sections, store the raw text content of their direct 'entries' array
            content = entry.entries.map(e => typeof e === 'string' ? cleanText(e) : '').filter(Boolean).join('\n');
            content = content ? `'${content}'` : 'NULL';
        }

        insertStatements.push(
            `INSERT INTO deck_entries (deck_id, entry_order, type, content, list_items, table_caption, table_col_labels, table_col_styles, table_rows, footnotes, raw_json) VALUES (` +
            `${deckId}, ${i}, ${entryType}, ${content}, ` +
            `${listItems}, ${tableCaption}, ` +
            `${tableColLabels}, ${tableColStyles}, ` +
            `${tableRows}, ${footnotes}, ` +
            `${rawJson});`
        );
    }
    return insertStatements;
}

function generateInserts(jsonData, dbType, existingDeckNames, existingSourceNames) {
    const inserts = {
        sources: [],
        decks: [],
        deck_cards: [],
        deck_entries: [],
        deck_other_sources: []
    };

    const sourcesMap = {};
    let currentSourceId = 1;
    for (const sourceName of existingSourceNames) {
        sourcesMap[sourceName] = currentSourceId++;
    }

    for (const deckData of jsonData) {
        const name = cleanText(deckData.name);

        if (existingDeckNames.has(name)) {
            continue;
        }

        const source = cleanText(deckData.source);
        if (!(source in sourcesMap)) {
            sourcesMap[source] = currentSourceId++;
            if (!existingSourceNames.has(source)) {
                inserts.sources.push(`INSERT INTO sources (name) VALUES ('${source}');`);
            }
        }
        const sourceId = sourcesMap[source];

        const page = deckData.page || 'NULL';
        const hasCardArt = !!deckData.hasCardArt;
        const backImageType = deckData.back && deckData.back.type ? cleanText(deckData.back.type) : 'NULL';
        const backImagePath = deckData.back && deckData.back.href && deckData.back.href.path ? cleanText(deckData.back.href.path) : 'NULL';
        const backImageWidth = deckData.back && deckData.back.width ? deckData.back.width : 'NULL';
        const backImageHeight = deckData.back && deckData.back.height ? deckData.back.height : 'NULL';
        const backImageCredit = deckData.back && deckData.back.credit ? cleanText(deckData.back.credit) : 'NULL';

        if (dbType === 'postgres') {
            inserts.decks.push(
                `DO $DECK_INSERT_BLOCK$\nDECLARE\n    deck_id_var INTEGER;\nBEGIN\n    INSERT INTO decks (name, source_id, page, has_card_art, back_image_type, back_image_path, back_image_width, back_image_height, back_image_credit) VALUES (` +
                `'${name}', ${sourceId}, ${page}, ${hasCardArt}, ${backImageType !== 'NULL' ? `'${backImageType}'` : 'NULL'}, ` +
                `${backImagePath !== 'NULL' ? `'${backImagePath}'` : 'NULL'}, ${backImageWidth}, ${backImageHeight}, ` +
                `${backImageCredit !== 'NULL' ? `'${backImageCredit}'` : 'NULL'}) RETURNING id INTO deck_id_var;\n`
            );
        } else if (dbType === 'sqlite') {
            inserts.decks.push(
                `INSERT INTO decks (name, source_id, page, has_card_art, back_image_type, back_image_path, back_image_width, back_image_height, back_image_credit) VALUES (` +
                `'${name}', ${sourceId}, ${page}, ${hasCardArt ? 1 : 0}, ${backImageType !== 'NULL' ? `'${backImageType}'` : 'NULL'}, ` +
                `${backImagePath !== 'NULL' ? `'${backImagePath}'` : 'NULL'}, ${backImageWidth}, ${backImageHeight}, ` +
                `${backImageCredit !== 'NULL' ? `'${backImageCredit}'` : 'NULL'});`
            );
        }

        const deckIdPlaceholder = dbType === 'postgres' ? 'deck_id_var' : inserts.decks.length; // Use pseudo-ID for SQLite, variable for Postgres

        // Deck Cards
        if (deckData.cards && Array.isArray(deckData.cards)) {
            for (const card of deckData.cards) {
                let uid = 'NULL';
                let replacement = false;
                let count = 'NULL';

                if (typeof card === 'string') {
                    uid = cleanText(card);
                } else if (typeof card === 'object' && card !== null) {
                    uid = card.uid ? cleanText(card.uid) : 'NULL';
                    replacement = !!card.replacement;
                    count = card.count || 'NULL';
                }
                if (dbType === 'postgres') {
                    inserts.decks.push(
                        `INSERT INTO deck_cards (deck_id, uid, replacement, count) VALUES (${deckIdPlaceholder}, ${uid !== 'NULL' ? `'${uid}'` : 'NULL'}, ${replacement}, ${count});\n`
                    );
                } else if (dbType === 'sqlite') {
                    inserts.decks.push(
                        `INSERT INTO deck_cards (deck_id, uid, replacement, count) VALUES (${deckIdPlaceholder}, ${uid !== 'NULL' ? `'${uid}'` : 'NULL'}, ${replacement ? 1 : 0}, ${count});\n`
                    );
                }
            }
        }

        // Deck Entries
        if (deckData.entries) {
            inserts.decks.push(...parseDeckEntries(deckIdPlaceholder, deckData.entries, dbType));
        }

        // Deck Other Sources
        if (deckData.otherSources && Array.isArray(deckData.otherSources)) {
            for (const otherSource of deckData.otherSources) {
                const osName = otherSource.source ? cleanText(otherSource.source) : 'NULL';
                const osPage = otherSource.page || 'NULL';
                inserts.decks.push(
                    `INSERT INTO deck_other_sources (deck_id, source_name, page) VALUES (${deckIdPlaceholder}, '${osName}', ${osPage});\n`
                );
            }
        }
        if (dbType === 'postgres') {
            inserts.decks.push(`END $DECK_INSERT_BLOCK$;\n\n`);
        }
    }

    return inserts;
}

function getExistingNames(filePath, type) {
    const existingNames = new Set();
    const existingSourceNames = new Set();
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        // Replace smart quotes with standard quotes before regex matching
        const normalizedContent = content.replace(/[‘’]/g, "'");

        // Corrected regex: double escape backslashes for literal parentheses and single quotes
        const mainRegex = new RegExp(`INSERT INTO ${type}s \(name,\s*.*?VALUES \(\'(.*?)\'\,\s*`, 'g');
        const sourceRegex = new RegExp(`INSERT INTO sources \(name\) VALUES \(\'(.*?)\'\);`, 'g');

        let match;
        while ((match = mainRegex.exec(normalizedContent)) !== null) {
            existingNames.add(match[1].replace(/''/g, "'"));
        }
        while ((match = sourceRegex.exec(normalizedContent)) !== null) {
            existingSourceNames.add(match[1].replace(/''/g, "'"));
        }
    }
    return { existingNames, existingSourceNames };
}

async function main() {
    const scriptDir = 'C:\\Projects\\dnd-class-data';
    const rawDataDir = path.join(scriptDir, 'raw-data');
    const postgresInsertsPath = path.join(scriptDir, 'postgres', 'insert_decks_postgres.sql');
    const sqliteInsertsPath = path.join(scriptDir, 'sqlite', 'insert_decks_sqlite.sql');

    const decksJsonPath = path.join(rawDataDir, 'decks.json');

    let allDecksData = { deck: [] };

    try {
        const data = JSON.parse(fs.readFileSync(decksJsonPath, 'utf-8'));
        allDecksData.deck.push(...(data.deck || []));
    } catch (error) {
        console.error(`Error reading decks.json: ${error.message}`);
        return;
    }

    const { existingNames: pgExistingDeckNames, existingSourceNames: pgExistingSourceNames } = getExistingNames(postgresInsertsPath, 'deck');
    const { existingNames: sqliteExistingDeckNames, existingSourceNames: sqliteExistingSourceNames } = getExistingNames(sqliteInsertsPath, 'deck');

    const pgInserts = generateInserts(allDecksData.deck, 'postgres', pgExistingDeckNames, pgExistingSourceNames);
    const sqliteInserts = generateInserts(allDecksData.deck, 'sqlite', sqliteExistingDeckNames, sqliteExistingSourceNames);

    // Write PostgreSQL inserts
    let pgOutput = `-- Source Inserts\n` + pgInserts.sources.join('\n') + '\n\n';
    for (const table in pgInserts) {
        if (table !== 'sources') {
            pgOutput += `-- ${table.replace(/_/g, ' ').replace(/deck/g, 'Deck')} Inserts\n` + pgInserts[table].join('\n') + '\n\n';
        }
    }
    fs.writeFileSync(path.join(scriptDir, 'insert_decks_postgres.sql'), pgOutput, 'utf-8');
    console.log('Generated insert_decks_postgres.sql in the root directory.');

    // Write SQLite inserts
    let sqliteOutput = `-- Source Inserts\n` + sqliteInserts.sources.join('\n') + '\n\n';
    for (const table in sqliteInserts) {
        if (table !== 'sources') {
            sqliteOutput += `-- ${table.replace(/_/g, ' ').replace(/deck/g, 'Deck')} Inserts\n` + sqliteInserts[table].join('\n') + '\n\n';
        }
    }
    fs.writeFileSync(path.join(scriptDir, 'insert_decks_sqlite.sql'), sqliteOutput, 'utf-8');
    console.log('Generated insert_decks_sqlite.sql in the root directory.');
}

main();
