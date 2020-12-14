'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        email: "admin@mail.com",
        password: "111aaaAAA",
        name: "Admin",
        lastname: "Admin",
        fullname: "Admin Admin",
        gender: "M",
        birthdate: 315532800000,
        city: 'Kharkiv'
      },
      {
        id: 2,
        email: "user1@mail.com",
        password: "111aaaAAA",
        name: "User1",
        lastname: "Test",
        fullname: "User1 Test",
        gender: "F",
        birthdate: 631152000000,
        city: 'Kyiv'
      },
      {
        id: 3,
        email: "user2@mail.com",
        password: "111aaaAAA",
        name: "User2",
        fullname: "User2",
        gender: "NB",
        birthdate: 946684800000,
        city: 'Valky'
      },
      {
        id: 4,
        email: "user3@mail.com",
        password: "111aaaAAA",
        name: "User3",
        fullname: "User3",
        gender: "F",
        birthdate: 946684800000,
        city: 'City'
      },
      {
        id: 5,
        email: "user4@mail.com",
        password: "111aaaAAA",
        name: "User4",
        fullname: "User4",
        gender: "M",
        birthdate: 946684800000,
        city: 'Village'
      }
  ], {});

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
