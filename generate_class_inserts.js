
const fs = require('fs');
const path = require('path');

const rawDataDir = path.join(__dirname, 'raw-data');
const outputDir = path.join(__dirname, 'postgres');

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

for (const classFile of classFiles) {
    const filePath = path.join(rawDataDir, classFile);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);

    if (data.class) {
        for (const classData of data.class) {
            const sourceId = sourceNameToIdMap[classData.source] || null;
            insertStatements += `INSERT INTO classes (name, source_id, page, hd_number, hd_faces, spellcasting_ability, caster_progression, prepared_spells, prepared_spells_change, has_fluff, has_fluff_images) VALUES ('${classData.name.replace(/'/g, "''")}', ${sourceId}, ${classData.page}, ${classData.hd.number}, ${classData.hd.faces}, '${classData.spellcastingAbility}', '${classData.casterProgression}', '${classData.preparedSpells}', '${classData.preparedSpellsChange}', ${classData.hasFluff || false}, ${classData.hasFluffImages || false}) ON CONFLICT (name) DO NOTHING;\n`;
        }
    }

    if (data.subclass) {
        for (const subclassData of data.subclass) {
            const sourceId = sourceNameToIdMap[subclassData.source] || null;
            insertStatements += `INSERT INTO subclasses (name, short_name, source_id, class_name, class_source, page, has_fluff, has_fluff_images) VALUES ('${subclassData.name.replace(/'/g, "''")}', '${subclassData.shortName.replace(/'/g, "''")}', ${sourceId}, '${subclassData.className.replace(/'/g, "''")}', '${subclassData.classSource}', ${subclassData.page}, ${subclassData.hasFluff || false}, ${subclassData.hasFluffImages || false}) ON CONFLICT (name) DO NOTHING;\n`;
        }
    }

    if (data.classFeature) {
        for (const feature of data.classFeature) {
            const sourceId = sourceNameToIdMap[feature.source] || null;
            insertStatements += `INSERT INTO features (name, source_id, page, class_name, class_source, subclass_short_name, subclass_source, level, header, has_fluff, has_fluff_images) VALUES ('${feature.name.replace(/'/g, "''")}', ${sourceId}, ${feature.page}, '${feature.className.replace(/'/g, "''")}', '${feature.classSource}', '${feature.subclassShortName}', '${feature.subclassSource}', ${feature.level}, ${feature.header || null}, ${feature.hasFluff || false}, ${feature.hasFluffImages || false}) ON CONFLICT (name) DO NOTHING;\n`;
        }
    }

    if (data.subclassFeature) {
        for (const feature of data.subclassFeature) {
            const sourceId = sourceNameToIdMap[feature.source] || null;
            insertStatements += `INSERT INTO features (name, source_id, page, class_name, class_source, subclass_short_name, subclass_source, level, header, has_fluff, has_fluff_images) VALUES ('${feature.name.replace(/'/g, "''")}', ${sourceId}, ${feature.page}, '${feature.className.replace(/'/g, "''")}', '${feature.classSource}', '${feature.subclassShortName}', '${feature.subclassSource}', ${feature.level}, ${feature.header || null}, ${feature.hasFluff || false}, ${feature.hasFluffImages || false}) ON CONFLICT (name) DO NOTHING;\n`;
        }
    }
}

fs.writeFileSync(path.join(outputDir, 'insert_classes_postgres.sql'), insertStatements);

console.log('SQL insert statements for classes, subclasses and features generated successfully.');

