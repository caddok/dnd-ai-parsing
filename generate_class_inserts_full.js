const fs = require('fs');
const path = require('path');

const rawDataDir = path.join(__dirname, 'raw-data');
const outputDir = __dirname;

const classFiles = fs.readdirSync(rawDataDir).filter(file => file.startsWith('class-') && file.endsWith('.json'));

let insertStatements = '';

const sourceNameToIdMap = {
    "PHB": 1,
    "TCE": 2,
    "XGE": 3,
    "VGM": 4,
    "MTF": 5,
    "DMG": 6,
    "MM": 7,
    "MPMM": 8,
    "ERLW": 9,
    "EGW": 10
};

const getSourceId = (source) => sourceNameToIdMap[source] || null;

const escapeSql = (str) => {
    if (str === null || typeof str === 'undefined') {
        return 'NULL';
    }
    if (typeof str === 'boolean') {
        return str ? 'TRUE' : 'FALSE';
    }
    if (typeof str === 'number') {
        return str;
    }
    if (typeof str === 'string') {
        return `'${str.replace(/'/g, "''")}'`;
    }
    if (typeof str === 'object') {
        return `'${JSON.stringify(str).replace(/'/g, "''")}'`;
    }
    return 'NULL';
};

for (const classFile of classFiles) {
    const filePath = path.join(rawDataDir, classFile);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);

    if (data.class) {
        for (const classData of data.class) {
            const className = classData.name;
            const classSource = classData.source;
            const classId = `(SELECT id FROM classes WHERE name = ${escapeSql(className)})`;

            insertStatements += `INSERT INTO classes (name, source_id, page, hd_number, hd_faces, spellcasting_ability, caster_progression, prepared_spells, prepared_spells_change, has_fluff, has_fluff_images) VALUES (${escapeSql(className)}, ${getSourceId(classSource)}, ${classData.page}, ${classData.hd.number}, ${classData.hd.faces}, ${escapeSql(classData.spellcastingAbility)}, ${escapeSql(classData.casterProgression)}, ${escapeSql(classData.preparedSpells)}, ${escapeSql(classData.preparedSpellsChange)}, ${classData.hasFluff || false}, ${classData.hasFluffImages || false}) ON CONFLICT (name) DO NOTHING;
`;

            if (classData.otherSources) {
                for (const otherSource of classData.otherSources) {
                    insertStatements += `INSERT INTO class_other_sources (class_id, source_name, page) VALUES (${classId}, ${escapeSql(otherSource.source)}, ${otherSource.page});
`;
                }
            }

            if (classData.proficiency) {
                for (const prof of classData.proficiency) {
                    insertStatements += `INSERT INTO class_proficiencies (class_id, proficiency_name) VALUES (${classId}, ${escapeSql(prof)});
`;
                }
            }

            if (classData.cantripProgression) {
                classData.cantripProgression.forEach((cantripsKnown, level) => {
                    insertStatements += `INSERT INTO class_cantrip_progression (class_id, level, cantrips_known) VALUES (${classId}, ${level + 1}, ${cantripsKnown});
`;
                });
            }

            if (classData.optionalfeatureProgression) {
                for (const prog of classData.optionalfeatureProgression) {
                    insertStatements += `INSERT INTO class_optional_feature_progression (class_id, name, feature_type, progression) VALUES (${classId}, ${escapeSql(prog.name)}, ${escapeSql(prog.featureType)}, ${escapeSql(prog.progression)});
`;
                }
            }

            if (classData.startingProficiencies) {
                if (classData.startingProficiencies.armor) {
                    for (const armor of classData.startingProficiencies.armor) {
                        insertStatements += `INSERT INTO class_starting_proficiencies_armor (class_id, armor_type) VALUES (${classId}, ${escapeSql(armor)});
`;
                    }
                }
                if (classData.startingProficiencies.weapons) {
                    for (const weapon of classData.startingProficiencies.weapons) {
                        if(typeof weapon === 'string'){
                           insertStatements += `INSERT INTO class_starting_proficiencies_weapons (class_id, weapon_type, optional) VALUES (${classId}, ${escapeSql(weapon)}, false);
`;
                        } else {
                           insertStatements += `INSERT INTO class_starting_proficiencies_weapons (class_id, weapon_type, optional) VALUES (${classId}, ${escapeSql(weapon.proficiency)}, ${weapon.optional || false});
`;
                        }
                    }
                }
                if (classData.startingProficiencies.tools) {
                    for (const tool of classData.startingProficiencies.tools) {
                        insertStatements += `INSERT INTO class_starting_proficiencies_tools (class_id, tool_name) VALUES (${classId}, ${escapeSql(tool)});
`;
                    }
                }
                if (classData.startingProficiencies.skills) {
                    for (const skill of classData.startingProficiencies.skills) {
                        if (skill.choose) {
                            insertStatements += `INSERT INTO class_starting_proficiencies_skills (class_id, choose_from, count) VALUES (${classId}, ${escapeSql(skill.choose.from)}, ${skill.choose.count});
`;
                        }
                    }
                }
            }

            if (classData.startingEquipment) {
                if (classData.startingEquipment.default) {
                    for (const item of classData.startingEquipment.default) {
                        insertStatements += `INSERT INTO class_starting_equipment_default (class_id, description) VALUES (${classId}, ${escapeSql(item)});
`;
                    }
                }
                if (classData.startingEquipment.defaultData) {
                    for (const itemData of classData.startingEquipment.defaultData) {
                        insertStatements += `INSERT INTO class_starting_equipment_default_data (class_id, data_json) VALUES (${classId}, ${escapeSql(itemData)});
`;
                    }
                }
            }

            if (classData.multiclassing) {
                if (classData.multiclassing.requirements) {
                    for (const ability in classData.multiclassing.requirements) {
                        insertStatements += `INSERT INTO class_multiclassing_requirements (class_id, ability, score) VALUES (${classId}, ${escapeSql(ability)}, ${classData.multiclassing.requirements[ability]});
`;
                    }
                }
                if (classData.multiclassing.proficienciesGained) {
                    if (classData.multiclassing.proficienciesGained.armor) {
                        for (const armor of classData.multiclassing.proficienciesGained.armor) {
                            insertStatements += `INSERT INTO class_multiclassing_proficiencies_gained_armor (class_id, armor_type) VALUES (${classId}, ${escapeSql(armor)});
`;
                        }
                    }
                    if (classData.multiclassing.proficienciesGained.tools) {
                        for (const tool of classData.multiclassing.proficienciesGained.tools) {
                            insertStatements += `INSERT INTO class_multiclassing_proficiencies_gained_tools (class_id, tool_name) VALUES (${classId}, ${escapeSql(tool)});
`;
                        }
                    }
                }
            }

            if (classData.classTableGroups) {
                for (const group of classData.classTableGroups) {
                    insertStatements += `INSERT INTO class_table_groups (class_id, title, col_labels, rows, rows_spell_progression) VALUES (${classId}, ${escapeSql(group.title)}, ${escapeSql(group.colLabels)}, ${escapeSql(group.rows)}, ${escapeSql(group.rowsSpellProgression)});
`;
                }
            }
        }
    }

    if (data.subclass) {
        for (const subclassData of data.subclass) {
            const subclassName = subclassData.name;
            const subclassId = `(SELECT id FROM subclasses WHERE name = ${escapeSql(subclassName)})`;

            insertStatements += `INSERT INTO subclasses (name, short_name, source_id, class_name, class_source, page, has_fluff, has_fluff_images) VALUES (${escapeSql(subclassName)}, ${escapeSql(subclassData.shortName)}, ${getSourceId(subclassData.source)}, ${escapeSql(subclassData.className)}, ${escapeSql(subclassData.classSource)}, ${subclassData.page}, ${subclassData.hasFluff || false}, ${subclassData.hasFluffImages || false}) ON CONFLICT (name) DO NOTHING;
`;

            if (subclassData.otherSources) {
                for (const otherSource of subclassData.otherSources) {
                    insertStatements += `INSERT INTO subclass_other_sources (subclass_id, source_name, page) VALUES (${subclassId}, ${escapeSql(otherSource.source)}, ${otherSource.page});
`;
                }
            }

            if (subclassData.additionalSpells) {
                for (const spell of subclassData.additionalSpells) {
                    insertStatements += `INSERT INTO subclass_additional_spells (subclass_id, prepared_spells_json) VALUES (${subclassId}, ${escapeSql(spell)});
`;
                }
            }

            if (subclassData.subclassFeatures) {
                for (const feature of subclassData.subclassFeatures) {
                    const featureParts = feature.split('|');
                    const featureName = featureParts[0];
                    const featureLevel = featureParts[featureParts.length - 1];
                    insertStatements += `INSERT INTO subclass_features (subclass_id, name, source, level) VALUES (${subclassId}, ${escapeSql(featureName)}, ${escapeSql(featureParts[2])}, ${featureLevel});
`;
                }
            }
        }
    }

    const processFeatures = (features) => {
        if (!features) return;
        for (const feature of features) {
            const featureName = feature.name;
            const featureId = `(SELECT id FROM features WHERE name = ${escapeSql(featureName)} AND class_name = ${escapeSql(feature.className)} AND level = ${feature.level})`;

            insertStatements += `INSERT INTO features (name, source_id, page, class_name, class_source, subclass_short_name, subclass_source, level, header, has_fluff, has_fluff_images) VALUES (${escapeSql(featureName)}, ${getSourceId(feature.source)}, ${feature.page}, ${escapeSql(feature.className)}, ${escapeSql(feature.classSource)}, ${escapeSql(feature.subclassShortName)}, ${escapeSql(feature.subclassSource)}, ${feature.level}, ${feature.header || null}, ${feature.hasFluff || false}, ${feature.hasFluffImages || false}) ON CONFLICT (name) DO NOTHING;
`;

            if (feature.entries) {
                feature.entries.forEach((entry, index) => {
                    if (typeof entry === 'string') {
                        insertStatements += `INSERT INTO feature_entries (feature_id, entry_order, content) VALUES (${featureId}, ${index}, ${escapeSql(entry)});
`;
                    } else if (typeof entry === 'object') {
                        insertStatements += `INSERT INTO feature_entries (feature_id, entry_order, type, name, content, list_items, table_caption, table_col_labels, table_rows, raw_json) VALUES (${featureId}, ${index}, ${escapeSql(entry.type)}, ${escapeSql(entry.name)}, ${escapeSql(entry.entries ? JSON.stringify(entry.entries) : (entry.entry || entry.items))}, ${escapeSql(entry.items)}, ${escapeSql(entry.caption)}, ${escapeSql(entry.colLabels)}, ${escapeSql(entry.rows)}, ${escapeSql(entry)});
`;
                    }
                });
            }

            if (feature.otherSources) {
                for (const otherSource of feature.otherSources) {
                    insertStatements += `INSERT INTO feature_other_sources (feature_id, source_name, page) VALUES (${featureId}, ${escapeSql(otherSource.source)}, ${otherSource.page});
`;
                }
            }
        }
    };

    processFeatures(data.classFeature);
    processFeatures(data.subclassFeature);
}

fs.writeFileSync(path.join(outputDir, 'insert_classes_postgres.sql'), insertStatements);

console.log('SQL insert statements for classes generated successfully.');
