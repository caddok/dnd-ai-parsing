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

function generateInserts(jsonData, dbType, existingTableNames, existingSourceNames) {
    const inserts = {
        sources: [],
        tables: [],
        table_column_labels: [],
        table_column_styles: [],
        table_rows: [],
        table_footnotes: []
    };

    const sourcesMap = {};
    let currentSourceId = 1;
    for (const sourceName of existingSourceNames) {
        sourcesMap[sourceName] = currentSourceId++;
    }

    for (const tableData of jsonData) {
        const name = cleanText(tableData.name);

        if (existingTableNames.has(name)) {
            continue;
        }

        const source = cleanText(tableData.source);
        if (!(source in sourcesMap)) {
            sourcesMap[source] = currentSourceId++;
            if (!existingSourceNames.has(source)) {
                inserts.sources.push(`INSERT INTO sources (name) VALUES ('${source}');`);
            }
        }
        const sourceId = sourcesMap[source];

        const page = tableData.page || 'NULL';
        const caption = tableData.caption ? cleanText(tableData.caption) : 'NULL';

        if (dbType === 'postgres') {
            inserts.tables.push(
                `INSERT INTO tables (name, source_id, page, caption) VALUES (` +
                `'${name}', ${sourceId}, ${page}, ${caption !== 'NULL' ? `'${caption}'` : 'NULL'});`
            );
        } else if (dbType === 'sqlite') {
            inserts.tables.push(
                `INSERT INTO tables (name, source_id, page, caption) VALUES (` +
                `'${name}', ${sourceId}, ${page}, ${caption !== 'NULL' ? `'${caption}'` : 'NULL'});`
            );
        }

        const tableIdPlaceholder = inserts.tables.length; // Pseudo-ID

        // Table Column Labels
        if (tableData.colLabels && Array.isArray(tableData.colLabels)) {
            for (let i = 0; i < tableData.colLabels.length; i++) {
                const label = tableData.colLabels[i];
                inserts.table_column_labels.push(
                    `INSERT INTO table_column_labels (table_id, label_order, label_text) VALUES (${tableIdPlaceholder}, ${i}, '${cleanText(label)}');`
                );
            }
        }

        // Table Column Styles
        if (tableData.colStyles && Array.isArray(tableData.colStyles)) {
            for (let i = 0; i < tableData.colStyles.length; i++) {
                const style = tableData.colStyles[i];
                inserts.table_column_styles.push(
                    `INSERT INTO table_column_styles (table_id, style_order, style_text) VALUES (${tableIdPlaceholder}, ${i}, '${cleanText(style)}');`
                );
            }
        }

        // Table Rows
        if (tableData.rows && Array.isArray(tableData.rows)) {
            for (let i = 0; i < tableData.rows.length; i++) {
                const row = tableData.rows[i];
                const rowDataJson = JSON.stringify(row).replace(/'/g, "''");
                if (dbType === 'postgres') {
                    inserts.table_rows.push(
                        `INSERT INTO table_rows (table_id, row_order, row_data) VALUES (${tableIdPlaceholder}, '${rowDataJson}'::jsonb);`
                    );
                } else if (dbType === 'sqlite') {
                    inserts.table_rows.push(
                        `INSERT INTO table_rows (table_id, row_order, row_data) VALUES (${tableIdPlaceholder}, '${rowDataJson}');`
                    );
                }
            }
        }

        // Table Footnotes
        if (tableData.footnotes && Array.isArray(tableData.footnotes)) {
            for (let i = 0; i < tableData.footnotes.length; i++) {
                const footnote = tableData.footnotes[i];
                inserts.table_footnotes.push(
                    `INSERT INTO table_footnotes (table_id, footnote_order, footnote_text) VALUES (${tableIdPlaceholder}, '${cleanText(footnote)}');`
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
        // Corrected regex for main table names
        const mainRegex = new RegExp(`INSERT INTO ${type}s \n(name,.*?VALUES \n('(.*?)',`, 'g');
        // Corrected regex for source names
        const sourceRegex = /INSERT INTO sources \n(name) VALUES \n('(.*?)');/g;

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
    const postgresInsertsPath = path.join(scriptDir, 'postgres', 'insert_tables_postgres.sql');
    const sqliteInsertsPath = path.join(scriptDir, 'sqlite', 'insert_tables_sqlite.sql');

    const tablesJsonPath = path.join(rawDataDir, 'tables.json');

    let allTablesData = { table: [] };

    try {
        const data = JSON.parse(fs.readFileSync(tablesJsonPath, 'utf-8'));
        allTablesData.table.push(...(data.table || []));
    } catch (error) {
        console.error(`Error reading tables.json: ${error.message}`);
        return;
    }

    const { existingNames: pgExistingTableNames, existingSourceNames: pgExistingSourceNames } = getExistingNames(postgresInsertsPath, 'table');
    const { existingNames: sqliteExistingTableNames, existingSourceNames: sqliteExistingSourceNames } = getExistingNames(sqliteInsertsPath, 'table');

    const pgInserts = generateInserts(allTablesData.table, 'postgres', pgExistingTableNames, pgExistingSourceNames);
    const sqliteInserts = generateInserts(allTablesData.table, 'sqlite', sqliteExistingTableNames, sqliteExistingSourceNames);

    // Write PostgreSQL inserts
    let pgOutput = `-- Source Inserts\n` + pgInserts.sources.join('\n') + '\n\n';
    for (const table in pgInserts) {
        if (table !== 'sources') {
            pgOutput += `-- ${table.replace(/_/g, ' ').replace(/table/g, 'Table')} Inserts\n` + pgInserts[table].join('\n') + '\n\n';
        }
    }
    fs.writeFileSync(path.join(scriptDir, 'insert_tables_postgres.sql'), pgOutput, 'utf-8');
    console.log('Generated insert_tables_postgres.sql in the root directory.');

    // Write SQLite inserts
    let sqliteOutput = `-- Source Inserts\n` + sqliteInserts.sources.join('\n') + '\n\n';
    for (const table in sqliteInserts) {
        if (table !== 'sources') {
            sqliteOutput += `-- ${table.replace(/_/g, ' ').replace(/table/g, 'Table')} Inserts\n` + sqliteInserts[table].join('\n') + '\n\n';
        }
    }
    fs.writeFileSync(path.join(scriptDir, 'insert_tables_sqlite.sql'), sqliteOutput, 'utf-8');
    console.log('Generated insert_tables_sqlite.sql in the root directory.');
}

main();