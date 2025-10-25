import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modelsDir = path.join(__dirname, 'src/models');
const migrationsDir = path.join(__dirname, 'migrations');
if (!fs.existsSync(migrationsDir)) fs.mkdirSync(migrationsDir);

const timestamp = (offset = 0) => {
  const d = new Date(Date.now() + offset);
  return d
    .toISOString()
    .replace(/[-T:.Z]/g, '')
    .slice(0, 14);
};

// Load models and their dependencies
const models = [];
for (const file of fs
  .readdirSync(modelsDir)
  .filter((f) => f.endsWith('.models.js'))) {
  const modelPath = path.join(modelsDir, file);
  const { default: model } = await import(`file://${modelPath}`);

  const attributes = model.rawAttributes || {};
  const dependencies = Object.values(attributes)
    .filter((attr) => attr.references?.model)
    .map((attr) => attr.references.model.tableName || attr.references.model);

  models.push({
    name: model.tableName || path.basename(file, '.models.js') + 's',
    attributes,
    dependencies,
    file,
  });
}

// Topological sort to handle dependencies
function sortModels(models) {
  const sorted = [];
  const visited = new Set();

  function visit(model) {
    if (visited.has(model.name)) return;
    for (const dep of model.dependencies) {
      const depModel = models.find((m) => m.name === dep);
      if (depModel) visit(depModel);
    }
    visited.add(model.name);
    sorted.push(model);
  }

  for (const model of models) visit(model);
  return sorted;
}

const sortedModels = sortModels(models);

// Generate migrations
let timeOffset = 0;
for (const model of sortedModels) {
  const fields = Object.entries(model.attributes)
    .map(([name, attr]) => {
      let type = attr.type?.key
        ? `Sequelize.${attr.type.key}`
        : 'Sequelize.STRING';
      if (attr.type?.options?.values) {
        type = `Sequelize.ENUM(${attr.type.options.values.map((v) => `'${v}'`).join(', ')})`;
      }
      const allowNull = attr.allowNull === false ? 'allowNull: false' : '';
      return `      ${name}: { type: ${type}${allowNull ? `, ${allowNull}` : ''} }`;
    })
    .join(',\n');

  const migrationContent = `'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('${model.name}', {
${fields},
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('${model.name}');
  }
};
`;

  const fileName = `${timestamp(timeOffset)}-create-${model.name}.cjs`;
  fs.writeFileSync(path.join(migrationsDir, fileName), migrationContent);
  console.log(`Migration created: ${fileName}`);
  timeOffset += 1000; // offset 1s per migration to avoid duplicate timestamps
}
