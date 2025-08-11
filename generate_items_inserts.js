const fs = require('fs');
const path = require('path');

function cleanText(text) {
    if (typeof text !== 'string') {
        return text;
    }
    // Remove {@tag text|source|...} and similar patterns
    text = text.replace(/{@\w+\s*([^|]+?)(?:\|[^}]+?)?}/g, '$1');
    // Escape single quotes by doubling them for SQL
    text = text.replace(/'/g, "''");
    // No need to escape double quotes here, JSON.stringify will handle it.
    return text;
}

function parseItemEntries(itemId, entries, dbType) {
    const insertStatements = [];
    if (!entries || !Array.isArray(entries)) {
        return insertStatements;
    }

    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const entryType = entry.type || 'string';
        let content = null;
        let data = null;

        if (entryType === 'string') {
            content = cleanText(entry);
        } else {
            // For complex types, stringify the whole object to JSON
            data = JSON.stringify(entry);
            // Escape single quotes within the JSON string for SQL literal
            if (data) {
                data = data.replace(/'/g, "''");
            }
        }

        if (dbType === 'postgres') {
            insertStatements.push(
                `INSERT INTO item_entries (item_id, entry_order, type, content, data) VALUES (` +
                `${itemId}, ${i}, '${entryType}', ${content !== null ? "'" + content + "'" : 'NULL'}, ` +
                `${data !== null ? "'" + data + "'::jsonb" : 'NULL'});`
            );
        } else if (dbType === 'sqlite') {
            insertStatements.push(
                `INSERT INTO item_entries (item_id, entry_order, type, content, data) VALUES (` +
                `${itemId}, ${i}, '${entryType}', ${content !== null ? "'" + content + "'" : 'NULL'}, ` +
                `${data !== null ? "'" + data + "'" : 'NULL'});`
            );
        }
    }
    return insertStatements;
}

function generateInserts(jsonData, dbType, existingItemNames, existingSourceNames) {
    const itemInserts = [];
    const itemEntryInserts = [];
    const sourceInserts = [];
    const sourcesMap = {}; // To map source names to their IDs for this run

    // Populate sourcesMap with existing sources to maintain consistent IDs
    // This is a simplification. In a real scenario, you'd query the DB for max IDs.
    // For script generation, we'll just ensure new sources get new IDs.
    let currentSourceId = 1;
    for (const sourceName of existingSourceNames) {
        sourcesMap[sourceName] = currentSourceId++;
    }

    for (const itemData of jsonData) {
        const name = cleanText(itemData.name);

        // Skip if item already exists
        if (existingItemNames.has(name)) {
            continue;
        }

        const source = cleanText(itemData.source);
        const page = itemData.page !== undefined && itemData.page !== null ? itemData.page : 'NULL';
        const itemType = itemData.type !== undefined && itemData.type !== null ? cleanText(itemData.type) : 'NULL';
        const rarity = itemData.rarity !== undefined && itemData.rarity !== null ? cleanText(itemData.rarity) : 'NULL';
        const weight = itemData.weight !== undefined && itemData.weight !== null ? itemData.weight : 'NULL';
        const value = itemData.value !== undefined && itemData.value !== null ? itemData.value : 'NULL';
        const attunement = itemData.reqAttune !== undefined && itemData.reqAttune !== null;
        const reqAttune = itemData.reqAttune !== undefined && itemData.reqAttune !== null ? cleanText(itemData.reqAttune) : 'NULL';
        const tier = itemData.tier !== undefined && itemData.tier !== null ? cleanText(itemData.tier) : 'NULL';
        const recharge = itemData.recharge !== undefined && itemData.recharge !== null ? cleanText(itemData.recharge) : 'NULL';
        const charges = itemData.charges !== undefined && itemData.charges !== null ? itemData.charges : 'NULL';
        const dmg1 = itemData.dmg1 !== undefined && itemData.dmg1 !== null ? cleanText(itemData.dmg1) : 'NULL';
        const dmg2 = itemData.dmg2 !== undefined && itemData.dmg2 !== null ? cleanText(itemData.dmg2) : 'NULL';
        const dmgType = itemData.dmgType !== undefined && itemData.dmgType !== null ? cleanText(itemData.dmgType) : 'NULL';
        const rangeVal = itemData.range !== undefined && itemData.range !== null ? cleanText(itemData.range) : 'NULL';
        const weaponCategory = itemData.weaponCategory !== undefined && itemData.weaponCategory !== null ? cleanText(itemData.weaponCategory) : 'NULL';
        const ammoType = itemData.ammoType !== undefined && itemData.ammoType !== null ? cleanText(itemData.ammoType) : 'NULL';

        // Booleans
        const isContainer = !!itemData.container;
        const isStaff = !!itemData.staff;
        const isWand = !!itemData.wand;
        const isRod = !!itemData.rod;
        const isSentient = !!itemData.sentient;
        const isCursed = !!itemData.curse;
        const isSrd = !!itemData.srd;
        const isBasicRules = !!itemData.basicRules;

        // Handle properties (array of strings)
        const properties = itemData.property;
        let propertiesJson = 'NULL';
        if (properties) {
            propertiesJson = JSON.stringify(properties);
            propertiesJson = propertiesJson.replace(/'/g, "''"); // Escape single quotes within JSON string
        }

        // Handle roll_data (can be complex, store as JSON)
        const rollData = itemData.roll;
        let rollDataJson = 'NULL';
        if (rollData) {
            rollDataJson = JSON.stringify(rollData);
            rollDataJson = rollDataJson.replace(/'/g, "''"); // Escape single quotes within JSON string
        }

        // Handle misc_data (catch-all for other fields not explicitly mapped)
        const miscDataKeys = [
            "name", "source", "page", "type", "rarity", "weight", "value",
            "reqAttune", "tier", "recharge", "charges", "roll", "dmg1", "dmg2",
            "dmgType", "range", "weaponCategory", "ammoType", "container",
            "staff", "wand", "rod", "sentient", "curse", "srd", "basicRules",
            "property", "entries", "_meta", "reqAttuneTags", "bonusSpellAttack",
            "bonusSpellSaveDc", "focus", "bonusWeapon", "hasFluffImages",
            "hasFluff", "resist", "conditionImmune", "ability", "attachedSpells",
            "group", "scfType", "detail1", "tattoo", "hasRefs", "additionalSources",
            "additionalEntries", "lootTables", "miscTags", "age", "arrow",
            "packContents", "needleBlowgun", "bolt", "dagger", "bulletFirearm",
            "bulletSling", "club", "crossbow", "hammer", "bow", "sword", "polearm",
            "lance", "net", "spear", "rapier", "scfType", "ac", "strength", "stealth",
            "vehAc", "vehHp", "vehSpeed", "crew", "capPassenger", "capCargo",
            "cellEnergy", "light", "modifySpeed"
        ];
        const miscData = {};
        for (const key in itemData) {
            if (itemData.hasOwnProperty(key) && !miscDataKeys.includes(key)) {
                miscData[key] = itemData[key];
            }
        }
        let miscDataJson = 'NULL';
        if (Object.keys(miscData).length > 0) {
            miscDataJson = JSON.stringify(miscData);
            miscDataJson = miscDataJson.replace(/'/g, "''"); // Escape single quotes within JSON string
        }

        // Determine stealth_disadvantage and strength_req for armor
        let stealthDisadvantage = false;
        let strengthReq = 'NULL';
        let armorAc = 'NULL';
        let armorDexMod = false;

        if (['LA', 'MA', 'HA'].includes(itemType)) { // Light, Medium, Heavy Armor
            armorAc = itemData.ac !== undefined && itemData.ac !== null ? itemData.ac : 'NULL';
            if (itemData.stealth === true) {
                stealthDisadvantage = true;
            }
            if (itemData.strength !== undefined && itemData.strength !== null) {
                try {
                    strengthReq = parseInt(itemData.strength);
                } catch (e) {
                    strengthReq = 'NULL';
                }
            }

            if (itemType === 'LA') { // Light Armor
                armorDexMod = true;
            } else if (itemType === 'MA') { // Medium Armor
                armorDexMod = true;
            } else if (itemType === 'HA') { // Heavy Armor
                armorDexMod = false;
            }
        }

        // Add source to the sourcesMap if not already present
        if (!(source in sourcesMap)) {
            sourcesMap[source] = currentSourceId++;
            sourceInserts.push(`INSERT INTO sources (name) VALUES ('${source}');`);
        }
        
        const sourceId = sourcesMap[source];

        // Construct the INSERT statement for the items table
        if (dbType === 'postgres') {
            itemInserts.push(
                `INSERT INTO items (name, source_id, page, type, rarity, weight, value, attunement, req_attune, tier, recharge, charges, roll_data, dmg1, dmg2, dmg_type, properties, range, stealth_disadvantage, strength_req, armor_ac, armor_dex_mod, weapon_category, ammo_type, is_container, is_staff, is_wand, is_rod, is_sentient, is_cursed, is_srd, is_basic_rules, misc_data) VALUES (` +
                `'${name}', ${sourceId}, ${page}, ${itemType !== 'NULL' ? "'" + itemType + "'" : 'NULL'}, ${rarity !== 'NULL' ? "'" + rarity + "'" : 'NULL'}, ${weight}, ${value}, ${attunement}, ${reqAttune !== 'NULL' ? "'" + reqAttune + "'" : 'NULL'}, ${tier !== 'NULL' ? "'" + tier + "'" : 'NULL'}, ${recharge !== 'NULL' ? "'" + recharge + "'" : 'NULL'}, ${charges}, ${rollDataJson !== 'NULL' ? "'" + rollDataJson + "'::jsonb" : 'NULL'}, ${dmg1 !== 'NULL' ? "'" + dmg1 + "'" : 'NULL'}, ${dmg2 !== 'NULL' ? "'" + dmg2 + "'" : 'NULL'}, ${dmgType !== 'NULL' ? "'" + dmgType + "'" : 'NULL'}, ${propertiesJson !== 'NULL' ? "'" + propertiesJson + "'::jsonb" : 'NULL'}, ${rangeVal !== 'NULL' ? "'" + rangeVal + "'" : 'NULL'}, ${stealthDisadvantage}, ${strengthReq}, ${armorAc}, ${armorDexMod}, ${weaponCategory !== 'NULL' ? "'" + weaponCategory + "'" : 'NULL'}, ${ammoType !== 'NULL' ? "'" + ammoType + "'" : 'NULL'}, ${isContainer}, ${isStaff}, ${isWand}, ${isRod}, ${isSentient}, ${isCursed}, ${isSrd}, ${isBasicRules}, ${miscDataJson !== 'NULL' ? "'" + miscDataJson + "'::jsonb" : 'NULL'});`
            );
        } else if (dbType === 'sqlite') {
            itemInserts.push(
                `INSERT INTO items (name, source_id, page, type, rarity, weight, value, attunement, req_attune, tier, recharge, charges, roll_data, dmg1, dmg2, dmg_type, properties, range, stealth_disadvantage, strength_req, armor_ac, armor_dex_mod, weapon_category, ammo_type, is_container, is_staff, is_wand, is_rod, is_sentient, is_cursed, is_srd, is_basic_rules, misc_data) VALUES (` +
                `'${name}', ${sourceId}, ${page}, ${itemType !== 'NULL' ? "'" + itemType + "'" : 'NULL'}, ${rarity !== 'NULL' ? "'" + rarity + "'" : 'NULL'}, ${weight}, ${value}, ${attunement ? 1 : 0}, ${reqAttune !== 'NULL' ? "'" + reqAttune + "'" : 'NULL'}, ${tier !== 'NULL' ? "'" + tier + "'" : 'NULL'}, ${recharge !== 'NULL' ? "'" + recharge + "'" : 'NULL'}, ${charges}, ${rollDataJson !== 'NULL' ? "'" + rollDataJson + "'" : 'NULL'}, ${dmg1 !== 'NULL' ? "'" + dmg1 + "'" : 'NULL'}, ${dmg2 !== 'NULL' ? "'" + dmg2 + "'" : 'NULL'}, ${dmgType !== 'NULL' ? "'" + dmgType + "'" : 'NULL'}, ${propertiesJson !== 'NULL' ? "'" + propertiesJson + "'" : 'NULL'}, ${rangeVal !== 'NULL' ? "'" + rangeVal + "'" : 'NULL'}, ${stealthDisadvantage ? 1 : 0}, ${strengthReq}, ${armorAc}, ${armorDexMod ? 1 : 0}, ${weaponCategory !== 'NULL' ? "'" + weaponCategory + "'" : 'NULL'}, ${ammoType !== 'NULL' ? "'" + ammoType + "'" : 'NULL'}, ${isContainer ? 1 : 0}, ${isStaff ? 1 : 0}, ${isWand ? 1 : 0}, ${isRod ? 1 : 0}, ${isSentient ? 1 : 0}, ${isCursed ? 1 : 0}, ${isSrd ? 1 : 0}, ${isBasicRules ? 1 : 0}, ${miscDataJson !== 'NULL' ? "'" + miscDataJson + "'" : 'NULL'});`
            );
        }

        const itemIdPlaceholder = itemInserts.length; // Pseudo-ID for item_entries
        const entries = itemData.entries;
        if (entries) {
            itemEntryInserts.push(...parseItemEntries(itemIdPlaceholder, entries, dbType));
        }
    }

    return { sourceInserts, itemInserts, itemEntryInserts };
}

function getExistingItemAndSourceNames(filePath) {
    const existingItemNames = new Set();
    const existingSourceNames = new Set();
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const itemRegex = /INSERT INTO items \(name,.*?VALUES \('(.*?)',/g;
        const sourceRegex = /INSERT INTO sources \(name\) VALUES \('(.*?)'\);/g;

        let match;
        while ((match = itemRegex.exec(content)) !== null) {
            existingItemNames.add(match[1].replace(/''/g, "'")); // Unescape single quotes
        }
        while ((match = sourceRegex.exec(content)) !== null) {
            existingSourceNames.add(match[1].replace(/''/g, "'")); // Unescape single quotes
        }
    }
    return { existingItemNames, existingSourceNames };
}

async function main() {
    const scriptDir = 'C:\\Projects\\dnd-class-data';
    const rawDataDir = path.join(scriptDir, 'raw-data');
    const postgresExistingInsertsPath = path.join(scriptDir, 'postgres', 'insert_items_postgres.sql');
    const sqliteExistingInsertsPath = path.join(scriptDir, 'sqlite', 'insert_items_sqlite.sql');

    const itemsJsonPath = path.join(rawDataDir, 'items.json');
    const itemsBaseJsonPath = path.join(rawDataDir, 'items-base.json');

    let allItemsData = [];

    try {
        const itemsData = JSON.parse(fs.readFileSync(itemsJsonPath, 'utf-8'));
        allItemsData.push(...(itemsData.item || []));
    } catch (error) {
        console.error(`Error reading items.json: ${error.message}`);
    }

    try {
        const itemsBaseData = JSON.parse(fs.readFileSync(itemsBaseJsonPath, 'utf-8'));
        allItemsData.push(...(itemsBaseData.baseitem || []));
    } catch (error) {
        console.error(`Error reading items-base.json: ${error.message}`);
    }

    // Get existing item and source names for de-duplication
    const { existingItemNames: pgExistingItemNames, existingSourceNames: pgExistingSourceNames } = getExistingItemAndSourceNames(postgresExistingInsertsPath);
    const { existingItemNames: sqliteExistingItemNames, existingSourceNames: sqliteExistingSourceNames } = getExistingItemAndSourceNames(sqliteExistingInsertsPath);

    // Generate Postgres inserts
    const { sourceInserts: pgSourceInserts, itemInserts: pgItemInserts, itemEntryInserts: pgItemEntryInserts } = generateInserts(allItemsData, 'postgres', pgExistingItemNames, pgExistingSourceNames);
    fs.writeFileSync(path.join(scriptDir, 'insert_items_postgres.sql'), `-- Source Inserts\n` + pgSourceInserts.join('\n') + `\n\n-- Item Inserts\n` + pgItemInserts.join('\n') + `\n\n-- Item Entry Inserts\n` + pgItemEntryInserts.join('\n'), 'utf-8');

    // Generate SQLite inserts
    const { sourceInserts: sqliteSourceInserts, itemInserts: sqliteItemInserts, itemEntryInserts: sqliteItemEntryInserts } = generateInserts(allItemsData, 'sqlite', sqliteExistingItemNames, sqliteExistingSourceNames);
    fs.writeFileSync(path.join(scriptDir, 'insert_items_sqlite.sql'), `-- Source Inserts\n` + sqliteSourceInserts.join('\n') + `\n\n-- Item Inserts\n` + sqliteItemInserts.join('\n') + `\n\n-- Item Entry Inserts\n` + sqliteItemEntryInserts.join('\n'), 'utf-8');

    console.log('Generated insert_items_postgres.sql and insert_items_sqlite.sql in the root directory.');
}

main();