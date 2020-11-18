'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('userRoles', [
      {
        id: 1,
        fkUserId: 1,
        fkRoleId: 1
      },
      {
        id: 2,
        fkUserId: 2,
        fkRoleId: 2
      },
      {
        id: 3,
        fkUserId: 3,
        fkRoleId: 3
      },
  ], {});

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('userRoles', null, {});
  }
};
