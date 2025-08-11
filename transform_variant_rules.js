const fs = require('fs');
const path = require('path');

const inputFilePath = path.join('C:', 'Projects', 'dnd-class-data', 'postgres', 'insert_variant_rules_postgres.sql');
const outputFilePath = path.join('C:', 'Projects', 'dnd-class-data', 'insert_variant_rules_procedural.sql');

function escapePgString(str) {
    if (str === null || str === undefined) {
        return 'NULL';
    }
    // Escape single quotes by doubling them
    const escapedStr = String(str).replace(/'/g, "''");
    return "'" + escapedStr + "'";
}

function processBlock(blockLines) {
    let processedBlock = `DO $$` +
`
DECLARE
    variant_rule_id_var INTEGER;
BEGIN
`;
    let firstInsert = true;

    for (const line of blockLines) {
        const trimmedLine = line.trim();

        if (trimmedLine.startsWith('INSERT INTO variant_rules')) {
            // Modify the main INSERT statement to return ID into the variable
            const modifiedLine = trimmedLine.replace('RETURNING id;', 'RETURNING id INTO variant_rule_id_var;');
            processedBlock += `    ${modifiedLine}
`;
            firstInsert = false;
        } else if (trimmedLine.startsWith('WITH new_rule AS (INSERT INTO variant_rules')) {
            // Skip the WITH clause line
            continue;
        } else if (trimmedLine.includes('(SELECT id FROM new_rule)')) {
            // Replace (SELECT id FROM new_rule) with the variable
            const modifiedLine = trimmedLine.replace(/\(SELECT id FROM new_rule\)/g, 'variant_rule_id_var');
            processedBlock += `    ${modifiedLine}
`;
        } else if (trimmedLine.length > 0) {
            // Add other non-empty lines, indented
            processedBlock += `    ${trimmedLine}
`;
        }
    }

    processedBlock += `END $$;

`;
    return processedBlock;
}

try {
    const data = fs.readFileSync(inputFilePath, 'utf8');
    const lines = data.split('\n');

    let output = '';
    let inBlock = false;
    let currentBlock = [];

    for (const line of lines) {
        const trimmedLine = line.trim();

        // Check for the start of a new variant rule block
        if (trimmedLine.startsWith('INSERT INTO variant_rules')) {
            if (inBlock) {
                // Process previous block before starting a new one
                output += processBlock(currentBlock);
                currentBlock = [];
            }
            inBlock = true;
            currentBlock.push(line);
        } else if (inBlock && (trimmedLine.startsWith('INSERT INTO variant_rule_entries') || trimmedLine.startsWith('WITH new_rule') || trimmedLine === '')) {
            // Continue current block
            currentBlock.push(line);
        } else {
            // Not part of a block, or a new block starts
            if (inBlock) {
                output += processBlock(currentBlock);
                currentBlock = [];
                inBlock = false;
            }
            output += line + '\n'; // Add non-block lines directly
        }
    }

    // Process the last block if any
    if (inBlock) {
        output += processBlock(currentBlock);
    }

    fs.writeFileSync(outputFilePath, output, 'utf8');
    console.log(`Successfully transformed and saved to ${outputFilePath}`);

} catch (err) {
    console.error('Error:', err);
}