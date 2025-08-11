
const fs = require('fs');
const path = require('path');

function escapeSingleQuotes(str) {
    return str.replace(/'/g, "''");
}

function generateInserts(data, dbType) {
    let postgresInserts = '';
    let sqliteInserts = '';

    const sources = new Set();
    const existingVariantRules = new Set();

    // Collect all unique sources first
    data.variantrule.forEach(rule => {
        if (rule.source) {
            sources.add(rule.source);
        }
        if (rule.additionalSources) {
            rule.additionalSources.forEach(s => sources.add(s.source));
        }
    });

    // Generate source inserts
    sources.forEach(source => {
        postgresInserts += `INSERT INTO sources (name) VALUES ('${escapeSingleQuotes(source)}') ON CONFLICT (name) DO NOTHING;\n`;
        sqliteInserts += `INSERT OR IGNORE INTO sources (name) VALUES ('${escapeSingleQuotes(source)}');\n`;
    });
    postgresInserts += '\n';
    sqliteInserts += '\n';

    data.variantrule.forEach(rule => {
        const ruleName = escapeSingleQuotes(rule.name);
        const sourceIdQuery = `(SELECT id FROM sources WHERE name = '${escapeSingleQuotes(rule.source)}')`;
        const page = rule.page || 'NULL';
        const ruleType = rule.ruleType ? `'${escapeSingleQuotes(rule.ruleType)}'` : 'NULL';
        const typeMain = rule.type ? `'${escapeSingleQuotes(rule.type)}'` : 'NULL';

        const ruleInsertPostgres = `INSERT INTO variant_rules (name, source_id, page, rule_type, type_main) VALUES ('${ruleName}', ${sourceIdQuery}, ${page}, ${ruleType}, ${typeMain}) ON CONFLICT (name) DO UPDATE SET source_id = EXCLUDED.source_id, page = EXCLUDED.page, rule_type = EXCLUDED.rule_type, type_main = EXCLUDED.type_main RETURNING id;`;
        const ruleInsertSqlite = `INSERT OR REPLACE INTO variant_rules (name, source_id, page, rule_type, type_main) VALUES ('${ruleName}', ${sourceIdQuery}, ${page}, ${ruleType}, ${typeMain});`;

        postgresInserts += ruleInsertPostgres + '\n';
        sqliteInserts += ruleInsertSqlite + '\n';

        // For entries, we need to get the ID of the newly inserted/updated variant_rule
        // PostgreSQL uses RETURNING id, SQLite uses last_insert_rowid()

        const processEntries = (entries, variantRuleIdQuery, orderOffset = 0) => {
            let entryInsertsPostgres = '';
            let entryInsertsSqlite = '';

            entries.forEach((entry, index) => {
                const entryOrder = orderOffset + index;
                const entryType = entry.type ? `'${escapeSingleQuotes(entry.type)}'` : 'NULL';
                const entryName = entry.name ? `'${escapeSingleQuotes(entry.name)}'` : 'NULL';
                const content = entry.entries && !entry.type ? `'${escapeSingleQuotes(JSON.stringify(entry.entries))}'` : 'NULL';
                const listItems = entry.type === 'list' && entry.items ? `'${escapeSingleQuotes(JSON.stringify(entry.items))}'` : 'NULL';
                const tableCaption = entry.type === 'table' && entry.caption ? `'${escapeSingleQuotes(entry.caption)}'` : 'NULL';
                const tableColLabels = entry.type === 'table' && entry.colLabels ? `'${escapeSingleQuotes(JSON.stringify(entry.colLabels))}'` : 'NULL';
                const tableColStyles = entry.type === 'table' && entry.colStyles ? `'${escapeSingleQuotes(JSON.stringify(entry.colStyles))}'` : 'NULL';
                const tableRows = entry.type === 'table' && entry.rows ? `'${escapeSingleQuotes(JSON.stringify(entry.rows))}'` : 'NULL';
                const rawJson = `'${escapeSingleQuotes(JSON.stringify(entry))}'`;

                entryInsertsPostgres += `INSERT INTO variant_rule_entries (variant_rule_id, entry_order, type, name, content, list_items, table_caption, table_col_labels, table_col_styles, table_rows, raw_json) VALUES (${variantRuleIdQuery}, ${entryOrder}, ${entryType}, ${entryName}, ${content}, ${listItems}::jsonb, ${tableCaption}, ${tableColLabels}::jsonb, ${tableColStyles}::jsonb, ${tableRows}::jsonb, ${rawJson}::jsonb);\n`;
                sqliteInserts += `INSERT INTO variant_rule_entries (variant_rule_id, entry_order, type, name, content, list_items, table_caption, table_col_labels, table_col_styles, table_rows, raw_json) VALUES (${variantRuleIdQuery}, ${entryOrder}, ${entryType}, ${entryName}, ${content}, ${listItems}, ${tableCaption}, ${tableColLabels}, ${tableColStyles}, ${tableRows}, ${rawJson});\n`;

                if (entry.entries && entry.type !== 'table' && entry.type !== 'list') {
                    const nestedInserts = processEntries(entry.entries, variantRuleIdQuery, entryOrder * 100); // Arbitrary offset for nested entries
                    entryInsertsPostgres += nestedInserts.postgres;
                    entryInsertsSqlite += nestedInserts.sqlite;
                }
            });
            return { postgres: entryInsertsPostgres, sqlite: entryInsertsSqlite };
        };

        // PostgreSQL: Use a CTE to get the ID
        postgresInserts += `WITH new_rule AS (${ruleInsertPostgres})\n`;
        postgresInserts += processEntries(rule.entries, `(SELECT id FROM new_rule)`).postgres;

        // SQLite: Use last_insert_rowid()
        sqliteInserts += processEntries(rule.entries, `(SELECT last_insert_rowid())`).sqlite;

        if (rule.additionalSources) {
            rule.additionalSources.forEach(s => {
                const additionalSourceIdQuery = `(SELECT id FROM sources WHERE name = '${escapeSingleQuotes(s.source)}')`;
                const additionalPage = s.page || 'NULL';
                postgresInserts += `INSERT INTO variant_rule_other_sources (variant_rule_id, source_name, page) VALUES ((SELECT id FROM variant_rules WHERE name = '${ruleName}'), '${escapeSingleQuotes(s.source)}', ${additionalPage}) ON CONFLICT DO NOTHING;\n`;
                sqliteInserts += `INSERT OR IGNORE INTO variant_rule_other_sources (variant_rule_id, source_name, page) VALUES ((SELECT id FROM variant_rules WHERE name = '${ruleName}'), '${escapeSingleQuotes(s.source)}', ${additionalPage});\n`;
            });
        }
        postgresInserts += '\n';
        sqliteInserts += '\n';
    });

    return { postgres: postgresInserts, sqlite: sqliteInserts };
}

async function main() {
    const scriptDir = 'C:\\Projects\\dnd-class-data';
    const rawDataPath = path.join(scriptDir, 'raw-data', 'variantrules.json');
    const postgresOutputPath = path.join(scriptDir, 'insert_variant_rules_postgres.sql');
    const sqliteOutputPath = path.join(scriptDir, 'insert_variant_rules_sqlite.sql');

    const data = JSON.parse(fs.readFileSync(rawDataPath, 'utf-8'));

    const { postgres, sqlite } = generateInserts(data, 'both');

    fs.writeFileSync(postgresOutputPath, postgres, 'utf-8');
    console.log('Generated insert_variant_rules_postgres.sql');

    fs.writeFileSync(sqliteOutputPath, sqlite, 'utf-8');
    console.log('Generated insert_variant_rules_sqlite.sql');
}

main();
