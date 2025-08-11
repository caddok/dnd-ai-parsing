
const fs = require('fs');

const backgrounds = JSON.parse(fs.readFileSync('C:/Projects/dnd-class-data/raw-data/backgrounds.json', 'utf8'));
const allTools = new Set();

backgrounds.background.forEach(bg => {
  if (bg.toolProficiencies) {
    bg.toolProficiencies.forEach(prof => {
      if (prof.choose) {
        prof.choose.from.forEach(tool => allTools.add(tool));
      } else {
        Object.keys(prof).forEach(tool => allTools.add(tool));
      }
    });
  }
});

let insertStatements = '';
allTools.forEach(tool => {
  const toolName = tool.replace(/'/g, "''");
  insertStatements += `INSERT INTO tools (name) VALUES ('${toolName}');\n`;
});

fs.writeFileSync('C:/Projects/dnd-class-data/insert_tools_postgres.sql', insertStatements);

console.log('insert_tools_postgres.sql created successfully.');
