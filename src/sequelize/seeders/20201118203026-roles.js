'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('roles', [
      {
        id: 1,
        roleName: "Admin",
        roleCode: "ADMIN"
      },
      {
        id: 2,
        roleName: "Manager",
        roleCode: "MANAGER"
      },
      {
        id: 3,
        roleName: "User",
        roleCode: "USER"
      },
  ], {});

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
