'use strict';
const slugify = require('slugify');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const modules = ['user', 'role'];

    const actions = ['create', 'show', 'update', 'delete'];

    const permissions = [];

    modules.forEach((module) => {
      actions.forEach((action) => {
        const name = `${action} ${module}`;
        permissions.push({
          name,
          slug: slugify(name, { lower: true, strict: true }),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      });
    });

    await queryInterface.bulkInsert('permissions', permissions, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};
