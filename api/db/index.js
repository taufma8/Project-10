'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

console.info('Instantiating and configuring the Sequelize object instance...');

const options = {
  dialect: 'sqlite',
  storage: 'users.db',
  storage: 'courses.db',
  define: {
    // This option removes the `createdAt` and `updatedAt` columns from the tables
    // that Sequelize generates from our users. These columns are often useful
    // with production apps, so we'd typically leave them enabled, but for our
    // purposes let's keep things as simple as possible.
    timestamps: false,
  },
};

const sequelize = new Sequelize(options);

const users = {};

// Import all of the users.
fs
  .readdirSync(path.join(__dirname, 'users'))
  .forEach((file) => {
    console.info(`Importing database model from file: ${file}`);
    const model = sequelize.import(path.join(__dirname, 'users', file));
    users[model.name] = model;
  });

// If available, call method to create associations.
Object.keys(users).forEach((userName) => {
  if (users[userName].associate) {
    console.info(`Configuring the associations for the ${userName} model...`);
    users[userName].associate(users);
  }
});

module.exports = {
  sequelize,
  Sequelize,
  users,
};
