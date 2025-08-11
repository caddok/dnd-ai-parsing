const fs = require('fs');
const path = require('path');

function parseSpellEntries(spellId, entries, dbType, parentEntryId = 'NULL') {
    const insertStatements = [];
    if (!entries || !Array.isArray(entries)) {
        return insertStatements;
    }

    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const entryType = entry.type || 'string';
        let content = null;
        let listItems = 'NULL';
        let tableCaption = 'NULL';
        let tableColLabels = 'NULL';
        let tableRows = 'NULL';
        let abilityAttributes = 'NULL';
        let refFeatureName = 'NULL';
        let refFeatureClass = 'NULL';
        let refFeatureSubclass = 'NULL';
        let refFeatureSource = 'NULL';
        let refFeatureLevel = 'NULL';
        let name = 'NULL';

        if (entryType !== 'string') {
            content = entry;
            // For complex types, stringify the whole object to JSON
            data = JSON.stringify(entry);
            // Escape single quotes within the JSON string for SQL literal
            if (data) {
                data = data.replace(/'/g, "''");
            }
        }

        if (dbType === 'postgres') {
            insertStatements.push(
                `INSERT INTO spell_entries (spell_id, parent_entry_id, entry_order, type, name, content, list_items, table_caption, table_col_labels, table_rows, ability_attributes, ref_feature_name, ref_feature_class, ref_feature_subclass, ref_feature_source, ref_feature_level) VALUES (` +
                `${spellId}, ${parentEntryId}, ${i}, '${entryType}', ${name !== 'NULL' ? "'" + name + "'" : 'NULL'}, ${content !== null ? "'" + content + "'" : 'NULL'}, ` +
                `${listItems !== 'NULL' ? "'" + listItems + "'::jsonb" : 'NULL'}, ${tableCaption !== 'NULL' ? "'" + tableCaption + "'" : 'NULL'}, ` +
                `${tableColLabels !== 'NULL' ? "'" + tableColLabels + "'::jsonb" : 'NULL'}, ${tableRows !== 'NULL' ? "'" + tableRows + "'::jsonb" : 'NULL'}, ` +
                `${abilityAttributes !== 'NULL' ? "'" + abilityAttributes + "'::jsonb" : 'NULL'}, ${refFeatureName !== 'NULL' ? "'" + refFeatureName + "'" : 'NULL'}, ` +
                `${refFeatureClass !== 'NULL' ? "'" + refFeatureClass + "'" : 'NULL'}, ${refFeatureSubclass !== 'NULL' ? "'" + refFeatureSubclass + "'" : 'NULL'}, ` +
                `${refFeatureSource !== 'NULL' ? "'" + refFeatureSource + "'" : 'NULL'}, ${refFeatureLevel});`
            );
        } else if (dbType === 'sqlite') {
            insertStatements.push(
                `INSERT INTO spell_entries (spell_id, parent_entry_id, entry_order, type, name, content, list_items, table_caption, table_col_labels, table_rows, ability_attributes, ref_feature_name, ref_feature_class, ref_feature_subclass, ref_feature_source, ref_feature_level) VALUES (` +
                `${spellId}, ${parentEntryId}, ${i}, '${entryType}', ${name !== 'NULL' ? "'" + name + "'" : 'NULL'}, ${content !== null ? "'" + content + "'" : 'NULL'}, ` +
                `${listItems !== 'NULL' ? "'" + listItems + "'" : 'NULL'}, ${tableCaption !== 'NULL' ? "'" + tableCaption + "'" : 'NULL'}, ` +
                `${tableColLabels !== 'NULL' ? "'" + tableColLabels + "'" : 'NULL'}, ${tableRows !== 'NULL' ? "'" + tableRows + "'" : 'NULL'}, ` +
                `${abilityAttributes !== 'NULL' ? "'" + abilityAttributes + "'" : 'NULL'}, ${refFeatureName !== 'NULL' ? "'" + refFeatureName + "'" : 'NULL'}, ` +
                `${refFeatureClass !== 'NULL' ? "'" + refFeatureClass + "'" : 'NULL'}, ${refFeatureSubclass !== 'NULL' ? "'" + refFeatureSubclass + "'" : 'NULL'}, ` +
                `${refFeatureSource !== 'NULL' ? "'" + refFeatureSource + "'" : 'NULL'}, ${refFeatureLevel});`
            );
        }

        // Recursively handle nested entries
        if ((entryType === 'entries' || entryType === 'inset') && entry.entries) {
            // For nested entries, the parent_entry_id will be the ID of the just inserted entry.
            // This is a simplification; in a real DB, you'd get the last_insert_rowid().
            // Here, we'll use a pseudo-ID based on the current length of itemEntryInserts.
            const currentEntryId = insertStatements.length; // Pseudo-ID for the current entry
            insertStatements.push(...parseSpellEntries(spellId, entry.entries, dbType, currentEntryId));
        }
    }
    return insertStatements;
}

function generateInserts(jsonData, dbType, existingSpellNames, existingSourceNames) {
    const spellInserts = [];
    const spellCastingTimeInserts = [];
    const spellRangeInserts = [];
    const spellComponentsInserts = [];
    const spellDurationInserts = [];
    const spellDamageInflictInserts = [];
    const spellAttackTypeInserts = [];
    const spellSavingThrowInserts = [];
    const spellConditionInflictInserts = [];
    const spellMiscTagsInserts = [];
    const spellEntryInserts = [];
    const sourcesMap = {};
    const sourceInserts = [];

    let currentSourceId = 1;
    for (const sourceName of existingSourceNames) {
        sourcesMap[sourceName] = currentSourceId++;
    }

    for (const spellData of jsonData) {
        const name = spellData.name;

        if (existingSpellNames.has(name)) {
            continue;
        }

        const source = spellData.source;
        const page = spellData.page || 'NULL';
        const level = spellData.level !== undefined && spellData.level !== null ? spellData.level : 'NULL';
        const school = spellData.school !== undefined && spellData.school !== null ? spellData.school : 'NULL';
        const srd = !!spellData.srd;
        const basicRules = !!spellData.basicRules;
        const hasFluff = !!spellData.hasFluff;
        const hasFluffImages = !!spellData.hasFluffImages;

        if (!(source in sourcesMap)) {
            sourcesMap[source] = currentSourceId++;
            // Only add source insert if it's truly new for this run
            if (!existingSourceNames.has(source)) {
                sourceInserts.push(`INSERT INTO sources (name) VALUES ('${source}');`);
            }
        }
        const sourceId = sourcesMap[source];

        // Spells table insert
        if (dbType === 'postgres') {
            spellInserts.push(
                `INSERT INTO spells (name, source_id, page, level, school, srd, basic_rules, has_fluff, has_fluff_images) VALUES (` +
                `'${name}', ${sourceId}, ${page}, ${level}, ${school !== 'NULL' ? "'" + school + "'" : 'NULL'}, ${srd}, ${basicRules}, ${hasFluff}, ${hasFluffImages});`
            );
        } else if (dbType === 'sqlite') {
            spellInserts.push(
                `INSERT INTO spells (name, source_id, page, level, school, srd, basic_rules, has_fluff, has_fluff_images) VALUES (` +
                `'${name}', ${sourceId}, ${page}, ${level}, ${school !== 'NULL' ? "'" + school + "'" : 'NULL'}, ${srd ? 1 : 0}, ${basicRules ? 1 : 0}, ${hasFluff ? 1 : 0}, ${hasFluffImages ? 1 : 0});`
            );
        }

        const spellIdPlaceholder = spellInserts.length; // Pseudo-ID for related tables

        // Casting Time
        if (spellData.time && Array.isArray(spellData.time)) {
            for (const time of spellData.time) {
                const timeNumber = time.number || 'NULL';
                const timeUnit = time.unit !== undefined && time.unit !== null ? time.unit : 'NULL';
                const condition = time.condition !== undefined && time.condition !== null ? time.condition : 'NULL';
                spellCastingTimeInserts.push(
                    `INSERT INTO spell_casting_time (spell_id, time_number, time_unit, condition) VALUES (` +
                    `${spellIdPlaceholder}, ${timeNumber}, ${timeUnit !== 'NULL' ? "'" + timeUnit + "'" : 'NULL'}, ${condition !== 'NULL' ? "'" + condition + "'" : 'NULL'});`
                );
            }
        }

        // Range
        if (spellData.range) {
            const rangeType = spellData.range.type !== undefined && spellData.range.type !== null ? spellData.range.type : 'NULL';
            const distanceAmount = spellData.range.distance && spellData.range.distance.amount !== undefined && spellData.range.distance.amount !== null ? spellData.range.distance.amount : 'NULL';
            const distanceUnit = spellData.range.distance && spellData.range.distance.unit !== undefined && spellData.range.distance.unit !== null ? spellData.range.distance.unit : 'NULL';
            const aoeType = spellData.range.aoe && spellData.range.aoe.type !== undefined && spellData.range.aoe.type !== null ? spellData.range.aoe.type : 'NULL';
            const aoeSize = spellData.range.aoe && spellData.range.aoe.size !== undefined && spellData.range.aoe.size !== null ? spellData.range.aoe.size : 'NULL';
            const aoeUnit = spellData.range.aoe && spellData.range.aoe.unit !== undefined && spellData.range.aoe.unit !== null ? spellData.range.aoe.unit : 'NULL';

            spellRangeInserts.push(
                `INSERT INTO spell_range (spell_id, range_type, distance_amount, distance_unit, aoe_type, aoe_size, aoe_unit) VALUES (` +
                `${spellIdPlaceholder}, ${rangeType !== 'NULL' ? "'" + rangeType + "'" : 'NULL'}, ${distanceAmount}, ${distanceUnit !== 'NULL' ? "'" + distanceUnit + "'" : 'NULL'}, ` +
                `${aoeType !== 'NULL' ? "'" + aoeType + "'" : 'NULL'}, ${aoeSize}, ${aoeUnit !== 'NULL' ? "'" + aoeUnit + "'" : 'NULL'});`
            );
        }

        // Components
        if (spellData.components) {
            const verbal = !!spellData.components.v;
            const somatic = !!spellData.components.s;
            const material = spellData.components.m !== undefined && spellData.components.m !== null ? spellData.components.m : 'NULL';
            const materialCost = spellData.components.m && spellData.components.m.cost !== undefined && spellData.components.m.cost !== null ? spellData.components.m.cost : 'NULL';
            const materialConsumed = !!(spellData.components.m && spellData.components.m.consume);

            if (dbType === 'postgres') {
                spellComponentsInserts.push(
                    `INSERT INTO spell_components (spell_id, verbal, somatic, material, material_cost, material_consumed) VALUES (` +
                    `${spellIdPlaceholder}, ${verbal}, ${somatic}, ${material !== 'NULL' ? "'" + material + "'" : 'NULL'}, ${materialCost}, ${materialConsumed});`
                );
            } else if (dbType === 'sqlite') {
                spellComponentsInserts.push(
                    `INSERT INTO spell_components (spell_id, verbal, somatic, material, material_cost, material_consumed) VALUES (` +
                    `${spellIdPlaceholder}, ${verbal ? 1 : 0}, ${somatic ? 1 : 0}, ${material !== 'NULL' ? "'" + material + "'" : 'NULL'}, ${materialCost}, ${materialConsumed ? 1 : 0});`
                );
            }
        }

        // Duration
        if (spellData.duration && Array.isArray(spellData.duration)) {
            for (const duration of spellData.duration) {
                const durationType = duration.type !== undefined && duration.type !== null ? duration.type : 'NULL';
                const durationAmount = duration.amount !== undefined && duration.amount !== null ? duration.amount : 'NULL';
                const durationUnit = duration.unit !== undefined && duration.unit !== null ? duration.unit : 'NULL';
                const concentration = !!duration.concentration;
                const upTo = !!duration.upTo;

                if (dbType === 'postgres') {
                    spellDurationInserts.push(
                        `INSERT INTO spell_duration (spell_id, duration_type, duration_amount, duration_unit, concentration, up_to) VALUES (` +
                        `${spellIdPlaceholder}, ${durationType !== 'NULL' ? "'" + durationType + "'" : 'NULL'}, ${durationAmount}, ${durationUnit !== 'NULL' ? "'" + durationUnit + "'" : 'NULL'}, ${concentration}, ${upTo});`
                    );
                } else if (dbType === 'sqlite') {
                    spellDurationInserts.push(
                        `INSERT INTO spell_duration (spell_id, duration_type, duration_amount, duration_unit, concentration, up_to) VALUES (` +
                        `${spellIdPlaceholder}, ${durationType !== 'NULL' ? "'" + durationType + "'" : 'NULL'}, ${durationAmount}, ${durationUnit !== 'NULL' ? "'" + durationUnit + "'" : 'NULL'}, ${concentration ? 1 : 0}, ${upTo ? 1 : 0});`
                    );
                }
            }
        }

        // Damage Inflict
        if (spellData.damageInflict && Array.isArray(spellData.damageInflict)) {
            for (const damageType of spellData.damageInflict) {
                spellDamageInflictInserts.push(
                    `INSERT INTO spell_damage_inflict (spell_id, damage_type) VALUES (` +
                    `${spellIdPlaceholder}, '${damageType}');`
                );
            }
        }

        // Attack Type
        if (spellData.spellAttack && Array.isArray(spellData.spellAttack)) {
            for (const attackType of spellData.spellAttack) {
                spellAttackTypeInserts.push(
                    `INSERT INTO spell_attack_type (spell_id, attack_type) VALUES (` +
                    `${spellIdPlaceholder}, '${attackType}');`
                );
            }
        }

        // Saving Throw
        if (spellData.savingThrow && Array.isArray(spellData.savingThrow)) {
            for (const sv of spellData.savingThrow) {
                const ability = sv.ability !== undefined && sv.ability !== null ? sv.ability : 'NULL';
                const successEffect = sv.success !== undefined && sv.success !== null ? sv.success : 'NULL';
                spellSavingThrowInserts.push(
                    `INSERT INTO spell_saving_throw (spell_id, ability, success_effect) VALUES (` +
                    `${spellIdPlaceholder}, ${ability !== 'NULL' ? "'" + ability + "'" : 'NULL'}, ${successEffect !== 'NULL' ? "'" + successEffect + "'" : 'NULL'});`
                );
            }
        }

        // Condition Inflict
        if (spellData.conditionInflict && Array.isArray(spellData.conditionInflict)) {
            for (const condition of spellData.conditionInflict) {
                spellConditionInflictInserts.push(
                    `INSERT INTO spell_condition_inflict (spell_id, condition_name) VALUES (` +
                    `${spellIdPlaceholder}, '${condition}');`
                );
            }
        }

        // Misc Tags
        if (spellData.miscTags && Array.isArray(spellData.miscTags)) {
            for (const tag of spellData.miscTags) {
                spellMiscTagsInserts.push(
                    `INSERT INTO spell_misc_tags (spell_id, tag) VALUES (` +
                    `${spellIdPlaceholder}, '${tag}');`
                );
            }
        }

        // Entries
        if (spellData.entries) {
            spellEntryInserts.push(...parseSpellEntries(spellIdPlaceholder, spellData.entries, dbType));
        }
    }

    return {
        sourceInserts,
        spellInserts,
        spellCastingTimeInserts,
        spellRangeInserts,
        spellComponentsInserts,
        spellDurationInserts,
        spellDamageInflictInserts,
        spellAttackTypeInserts,
        spellSavingThrowInserts,
        spellConditionInflictInserts,
        spellMiscTagsInserts,
        spellEntryInserts
    };
}

function getExistingSpellAndSourceNames(filePath) {
    const existingSpellNames = new Set();
    const existingSourceNames = new Set();
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const spellRegex = /INSERT INTO spells \(name,.*?VALUES \('(.*?)',/g;
        const sourceRegex = /INSERT INTO sources \(name\) VALUES \('(.*?)'\);/g;

        let match;
        while ((match = spellRegex.exec(content)) !== null) {
            existingSpellNames.add(match[1].replace(/''/g, "'"));
        }
        while ((match = sourceRegex.exec(content)) !== null) {
            existingSourceNames.add(match[1].replace(/''/g, "'"));
        }
    }
    return { existingSpellNames, existingSourceNames };
}

async function main() {
    const scriptDir = 'C:\\Projects\\dnd-class-data';
    const rawDataDir = path.join(scriptDir, 'raw-data');
    const postgresExistingInsertsPath = path.join(scriptDir, 'postgres', 'insert_spells_postgres.sql');
    const sqliteExistingInsertsPath = path.join(scriptDir, 'sqlite', 'insert_spells_sqlite.sql');

    const spellFiles = [
        'spells-egw.json',
        'spells-phb.json',
        'spells-tce.json',
        'spells-xge.json'
    ];

    let allSpellsData = [];

    for (const file of spellFiles) {
        const filePath = path.join(rawDataDir, file);
        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            allSpellsData.push(...(data.spell || []));
        } catch (error) {
            console.error(`Error reading ${file}: ${error.message}`);
        }
    }

    // Get existing spell and source names for de-duplication
    const { existingSpellNames: pgExistingSpellNames, existingSourceNames: pgExistingSourceNames } = getExistingSpellAndSourceNames(postgresExistingInsertsPath);
    const { existingSpellNames: sqliteExistingSpellNames, existingSourceNames: sqliteExistingSourceNames } = getExistingSpellAndSourceNames(sqliteExistingInsertsPath);

    // Generate Postgres inserts
    const pgInserts = generateInserts(allSpellsData, 'postgres', pgExistingSpellNames, pgExistingSourceNames);
    fs.writeFileSync(path.join(scriptDir, 'insert_spells_postgres.sql'),
        `-- Source Inserts\n` + pgInserts.sourceInserts.join('\n') +
        `\n\n-- Spell Inserts\n` + pgInserts.spellInserts.join('\n') +
        `\n\n-- Spell Casting Time Inserts\n` + pgInserts.spellCastingTimeInserts.join('\n') +
        `\n\n-- Spell Range Inserts\n` + pgInserts.spellRangeInserts.join('\n') +
        `\n\n-- Spell Components Inserts\n` + pgInserts.spellComponentsInserts.join('\n') +
        `\n\n-- Spell Duration Inserts\n` + pgInserts.spellDurationInserts.join('\n') +
        `\n\n-- Spell Damage Inflict Inserts\n` + pgInserts.spellDamageInflictInserts.join('\n') +
        `\n\n-- Spell Attack Type Inserts\n` + pgInserts.spellAttackTypeInserts.join('\n') +
        `\n\n-- Spell Saving Throw Inserts\n` + pgInserts.spellSavingThrowInserts.join('\n') +
        `\n\n-- Spell Condition Inflict Inserts\n` + pgInserts.spellConditionInflictInserts.join('\n') +
        `\n\n-- Spell Misc Tags Inserts\n` + pgInserts.spellMiscTagsInserts.join('\n') +
        `\n\n-- Spell Entry Inserts\n` + pgInserts.spellEntryInserts.join('\n'),
        'utf-8'
    );

    // Generate SQLite inserts
    const sqliteInserts = generateInserts(allSpellsData, 'sqlite', sqliteExistingSpellNames, sqliteExistingSourceNames);
    fs.writeFileSync(path.join(scriptDir, 'insert_spells_sqlite.sql'),
        `-- Source Inserts\n` + sqliteInserts.sourceInserts.join('\n') +
        `\n\n-- Spell Inserts\n` + sqliteInserts.spellInserts.join('\n') +
        `\n\n-- Spell Casting Time Inserts\n` + sqliteInserts.spellCastingTimeInserts.join('\n') +
        `\n\n-- Spell Range Inserts\n` + sqliteInserts.spellRangeInserts.join('\n') +
        `\n\n-- Spell Components Inserts\n` + sqliteInserts.spellComponentsInserts.join('\n') +
        `\n\n-- Spell Duration Inserts\n` + sqliteInserts.spellDurationInserts.join('\n') +
        `\n\n-- Spell Damage Inflict Inserts\n` + sqliteInserts.spellDamageInflictInserts.join('\n') +
        `\n\n-- Spell Attack Type Inserts\n` + sqliteInserts.spellAttackTypeInserts.join('\n') +
        `\n\n-- Spell Saving Throw Inserts\n` + sqliteInserts.spellSavingThrowInserts.join('\n') +
        `\n\n-- Spell Condition Inflict Inserts\n` + sqliteInserts.spellConditionInflictInserts.join('\n') +
        `\n\n-- Spell Misc Tags Inserts\n` + sqliteInserts.spellMiscTagsInserts.join('\n') +
        `\n\n-- Spell Entry Inserts\n` + sqliteInserts.spellEntryInserts.join('\n'),
        'utf-8'
    );

    console.log('Generated insert_spells_postgres.sql and insert_spells_sqlite.sql in the root directory.');
}

main();