'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('users', [
      {
        Id: 1,
        Name: "User1",
        Gender: "0",
      },
      {
      Id: 2,
      Name: 'User2',
      Gender: '0',
      },
      {
        Id: 3,
        Name: 'User3',
        Gender: '1',
      }
  ], {});

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
