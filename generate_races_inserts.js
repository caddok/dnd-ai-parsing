const fs = require('fs');
const path = require('path');

const racesJsonPath = path.join('C:', 'Projects', 'dnd-class-data', 'raw-data', 'races.json');
const outputSqlPath = path.join('C:', 'Projects', 'dnd-class-data', 'races_inserts_postgres.sql');

function escapePgString(str) {
    if (str === null || str === undefined) {
        return 'NULL';
    }
    // Escape single quotes by doubling them
    const escapedStr = String(str).replace(/'/g, "''");
    return `'${escapedStr}'`;
}

function formatPgArray(arr, type = 'TEXT') {
    if (!arr || arr.length === 0) {
        return `ARRAY[]::${type}[]`;
    }
    const escapedElements = arr.map(element => escapePgString(element));
    return `ARRAY[${escapedElements.join(',')}]::${type}[]`;
}

function cleanDescription(entries) {
    if (!entries || entries.length === 0) {
        return null;
    }
    let description = '';
    for (const entry of entries) {
        if (typeof entry === 'string') {
            description += entry + '\n';
        } else if (entry.entries) {
            // Recursively handle nested entries
            description += cleanDescription(entry.entries) + '\n';
        }
        // Add more conditions if other types of entries need specific handling
    }
    // Remove common markdown/special tags from the JSON data
    // This is a simplified cleanup; more robust parsing might be needed for all cases
    description = description.replace(/{@spell ([^|]+?)(?:|[^}]+?)?}/g, '$1'); // Remove {@spell ...}
    description = description.replace(/{@damage ([^|]+?)(?:|[^}]+?)?}/g, '$1'); // Remove {@damage ...}
    description = description.replace(/{@skill ([^|]+?)(?:|[^}]+?)?}/g, '$1'); // Remove {@skill ...}
    description = description.replace(/{@condition ([^|]+?)(?:|[^}]+?)?}/g, '$1'); // Remove {@condition ...}
    description = description.replace(/{@dc ([^}]+?)}/g, '$1'); // Remove {@dc ...}
    description = description.replace(/{@dice ([^}]+?)}/g, '$1'); // Remove {@dice ...}
    description = description.replace(/{@book ([^|]+?)(?:|[^}]+?)?}/g, '$1'); // Remove {@book ...}
    description = description.replace(/{@language ([^|]+?)(?:|[^}]+?)?}/g, '$1'); // Remove {@language ...}
    description = description.replace(/{@variantrule ([^|]+?)(?:|[^}]+?)?}/g, '$1'); // Remove {@variantrule ...}
    description = description.replace(/\s+/g, ' ').trim(); // Normalize whitespace

    return description.length > 0 ? description : null;
}

try {
    const rawData = fs.readFileSync(racesJsonPath, 'utf8');
    const jsonData = JSON.parse(rawData);
    const races = jsonData.race;

    let sqlStatements = '';

    for (const race of races) {
        const name = escapePgString(race.name);
        const source = escapePgString(race.source);
        const page = race.page || 'NULL';
        const size = formatPgArray(race.size);
        const speedWalk = race.speed && (typeof race.speed === 'number' ? race.speed : race.speed.walk) || 'NULL';
        const speedFly = race.speed && race.speed.fly && (typeof race.speed.fly === 'number' ? race.speed.fly : 'NULL') || 'NULL';
        const speedSwim = race.speed && race.speed.swim && (typeof race.speed.swim === 'number' ? race.speed.swim : 'NULL') || 'NULL';
        const ageMature = race.age && race.age.mature !== undefined ? race.age.mature : 'NULL';
        const ageMax = race.age && race.age.max !== undefined ? race.age.max : 'NULL';
        const darkvision = race.darkvision !== undefined ? race.darkvision : 'NULL';
        const description = escapePgString(cleanDescription(race.entries));
        const creatureTypes = formatPgArray(race.creatureTypes);
        const creatureTypeTags = formatPgArray(race.creatureTypeTags);
        const lineage = race.lineage ? escapePgString(race.lineage) : 'NULL';

        sqlStatements += `DO $$
DECLARE
    source_id_var INTEGER;
    race_id_var INTEGER;
BEGIN
    SELECT id INTO source_id_var FROM sources WHERE name ILIKE ${source} LIMIT 1;

    INSERT INTO races (name, source_id, page, size, speed_walk, speed_fly, speed_swim, age_mature, age_max, darkvision, description, creature_types, creature_type_tags, lineage)
    VALUES (${name}, source_id_var, ${page}, ${size}, ${speedWalk}, ${speedFly}, ${speedSwim}, ${ageMature}, ${ageMax}, ${darkvision}, ${description}, ${creatureTypes}, ${creatureTypeTags}, ${lineage})
    RETURNING id INTO race_id_var;
`;

        // Insert race ability scores
        if (race.ability && Array.isArray(race.ability)) {
            for (const abilitySet of race.ability) {
                for (const ability in abilitySet) {
                    if (abilitySet.hasOwnProperty(ability) && ability !== 'choose') {
                        const bonus = abilitySet[ability];
                        sqlStatements += `    INSERT INTO race_ability_scores (race_id, ability, bonus) VALUES (race_id_var, ${escapePgString(ability)}, ${bonus});
`;
                    }
                }
            }
        }

        // Insert race resistances
        if (race.resist && Array.isArray(race.resist)) {
            for (const damageType of race.resist) {
                sqlStatements += `    INSERT INTO race_resistances (race_id, damage_type_id) VALUES (race_id_var, (SELECT id FROM damage_types WHERE name ILIKE ${escapePgString(damageType)} LIMIT 1));
`;
            }
        }

        // Insert race language proficiencies
        if (race.languageProficiencies && Array.isArray(race.languageProficiencies)) {
            for (const langProf of race.languageProficiencies) {
                for (const lang in langProf) {
                    if (langProf.hasOwnProperty(lang) && langProf[lang] === true) {
                        sqlStatements += `    INSERT INTO race_language_proficiencies (race_id, language_id) VALUES (race_id_var, (SELECT id FROM languages WHERE name ILIKE ${escapePgString(lang)} LIMIT 1));
`;
                    }
                }
            }
        }

        // Insert race traits (from entries that have a name)
        if (race.entries && Array.isArray(race.entries)) {
            for (const entry of race.entries) {
                if (entry.name && entry.entries) {
                    const traitName = escapePgString(entry.name);
                    const traitDescription = escapePgString(cleanDescription(entry.entries));
                    sqlStatements += `    INSERT INTO race_traits (race_id, name, description) VALUES (race_id_var, ${traitName}, ${traitDescription});
`;
                }
            }
        }

        // Insert skill proficiencies as traits
        if (race.skillProficiencies && Array.isArray(race.skillProficiencies)) {
            for (const skillProf of race.skillProficiencies) {
                for (const skill in skillProf) {
                    if (skillProf.hasOwnProperty(skill) && skillProf[skill] === true) {
                        const traitName = escapePgString(`Proficiency: ${skill}`);
                        const traitDescription = escapePgString(`You have proficiency in the ${skill} skill.`);
                        sqlStatements += `    INSERT INTO race_traits (race_id, name, description) VALUES (race_id_var, ${traitName}, ${traitDescription});
`;
                    }
                }
            }
        }

        sqlStatements += `END $$;

`;
    }

    fs.writeFileSync(outputSqlPath, sqlStatements, 'utf8');
    console.log(`Successfully generated SQL inserts to ${outputSqlPath}`);

} catch (error) {
    console.error('Error generating SQL:', error);
}
