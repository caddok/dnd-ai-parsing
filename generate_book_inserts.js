const fs = require('fs');
const path = require('path');

const rawDataDir = path.join('C:', 'Projects', 'dnd-class-data', 'raw-data');
const outputSqlPath = path.join('C:', 'Projects', 'dnd-class-data', 'books_inserts_postgres.sql');

let allSqlStatements = '';

function escapePgString(str) {
    if (str === null || str === undefined) {
        return 'NULL';
    }
    // Escape single quotes by doubling them
    const escapedStr = String(str).replace(/'/g, "''");
    return escapedStr; // Return just the escaped content, without outer quotes
}

function formatPgArray(arr, type = 'TEXT') {
    if (!arr || arr.length === 0) {
        return `ARRAY[]::${type}[]`;
    }
    const escapedElements = arr.map(element => `'${escapePgString(element)}'`); // Add quotes here
    return `ARRAY[${escapedElements.join(',')}]::${type}[]`;
}

function cleanContent(entries) {
    if (!entries) {
        return null;
    }

    let content = '';
    if (Array.isArray(entries)) {
        for (const entry of entries) {
            if (typeof entry === 'string') {
                content += entry + '\n';
            } else if (entry.entries) {
                content += cleanContent(entry.entries) + '\n';
            } else if (entry.type === 'list' && entry.items) {
                // For lists, concatenate item entries
                content += cleanContent(entry.items) + '\n';
            } else if (entry.type === 'table' && entry.rows) {
                // For tables, concatenate row data
                for (const row of entry.rows) {
                    if (Array.isArray(row)) {
                        content += row.map(item => typeof item === 'object' ? JSON.stringify(item) : item).join(' ') + '\n';
                    }
                }
            }
            // Keep other types like 'image' for the main 'content' field
        }
    } else if (typeof entries === 'string') {
        content = entries;
    }

    // *** REMOVED ALL content.replace(/{@...}/g, '$1'); LINES HERE ***
    content = content.replace(/\s+/g, ' ').trim(); // Normalize whitespace (keep this for readability)

    return content.length > 0 ? content : null;
}


function processBookEntry(entry, bookId, entryOrder) {
    let sql = '';

    const type = entry.type ? `'${escapePgString(entry.type)}'` : 'NULL'; // Correctly quote type
    const name = entry.name ? `'${escapePgString(entry.name)}'` : 'NULL'; // Correctly quote name

    // Handle 'content' (cleaned text) - now includes {@...} tags
    const rawTextContent = cleanContent(entry.entries);
    const content = rawTextContent ? `'${escapePgString(rawTextContent)}'` : 'NULL'; // Correctly quote content

    // Handle 'raw_json'
    const rawJson = `'${escapePgString(JSON.stringify(entry))}'::jsonb`; // Correctly quote and cast raw_json

    // Handle 'list_items' (JSONB)
    let listItems = 'NULL::jsonb';
    if (entry.type === 'list' && entry.items) {
        listItems = `'${escapePgString(JSON.stringify(entry.items))}'::jsonb`; // Correctly quote and cast list_items
    }

    // Handle table-specific fields (JSONB)
    let tableCaption = 'NULL';
    let tableColLabels = 'NULL::jsonb';
    let tableColStyles = 'NULL::jsonb';
    let tableRows = 'NULL::jsonb';

    if (entry.type === 'table') {
        tableCaption = entry.caption ? `'${escapePgString(entry.caption)}'` : 'NULL'; // Correctly quote tableCaption
        if (entry.colLabels) {
            tableColLabels = `'${escapePgString(JSON.stringify(entry.colLabels))}'::jsonb`; // Correctly quote and cast
        }
        if (entry.colStyles) {
            tableColStyles = `'${escapePgString(JSON.stringify(entry.colStyles))}'::jsonb`; // Correctly quote and cast
        }
        if (entry.rows) {
            tableRows = `'${escapePgString(JSON.stringify(entry.rows))}'::jsonb`; // Correctly quote and cast
        }
    }

    sql += `    INSERT INTO book_entries (book_id, entry_order, type, name, content, list_items, table_caption, table_col_labels, table_col_styles, table_rows, raw_json)
`;
    sql += `    VALUES (${bookId}, ${entryOrder}, ${type}, ${name}, ${content}, ${listItems}, ${tableCaption}, ${tableColLabels}, ${tableColStyles}, ${tableRows}, ${rawJson});
`;

    return sql;
}

async function generateInserts() {
    const files = await fs.promises.readdir(rawDataDir);
    const bookFiles = files.filter(file => file.startsWith('book-') && file.endsWith('.json'));

    for (const fileName of bookFiles) {
        const filePath = path.join(rawDataDir, fileName);
        const sourceName = fileName.replace('book-', '').replace('.json', '').toUpperCase();

        try {
            const rawData = fs.readFileSync(filePath, 'utf8');
            const jsonData = JSON.parse(rawData);

            if (!jsonData.data || !Array.isArray(jsonData.data)) {
                console.warn(`Skipping ${fileName}: 'data' array not found or not an array.`);
                continue;
            }

            // Use a more unique dollar-quoted string for the block
            allSqlStatements += `DO $BOOK_INSERT_BLOCK$
DECLARE
    book_id_var INTEGER;
BEGIN
    -- Insert or update the book entry
    INSERT INTO books (name, source, page)
    VALUES ('${escapePgString(sourceName)}', '${escapePgString(sourceName)}', 1) -- Assuming page 1 for the main book entry
    ON CONFLICT (name, source) DO UPDATE SET page = EXCLUDED.page
    RETURNING id INTO book_id_var;
`;

            let entryOrder = 0;
            for (const section of jsonData.data) {
                // For each top-level section, insert an entry
                allSqlStatements += processBookEntry(section, 'book_id_var', entryOrder++);

                // Recursively process nested entries
                if (section.entries && Array.isArray(section.entries)) {
                    function processNestedEntries(entries, parentOrder) {
                        let nestedSql = '';
                        let currentNestedOrder = 0;
                        for (const entry of entries) {
                            // Only process if it's a structured entry, not just a string within a section's entries
                            if (typeof entry === 'object' && entry !== null) {
                                nestedSql += processBookEntry(entry, 'book_id_var', parseFloat(`${parentOrder}.${currentNestedOrder++}`));
                                if (entry.entries && Array.isArray(entry.entries)) {
                                    nestedSql += processNestedEntries(entry.entries, parseFloat(`${parentOrder}.${currentNestedOrder - 1}`));
                                }
                            }
                        }
                        return nestedSql;
                    }
                    allSqlStatements += processNestedEntries(section.entries, entryOrder - 1);
                }
            }

            allSqlStatements += `END $BOOK_INSERT_BLOCK$;

`;

        } catch (error) {
            console.error(`Error processing ${fileName}:`, error);
        }
    }

    fs.writeFileSync(outputSqlPath, allSqlStatements, 'utf8');
    console.log(`All book inserts generated to ${outputSqlPath}`);
}

generateInserts();
