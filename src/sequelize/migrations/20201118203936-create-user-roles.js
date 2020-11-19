'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('userRoles', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fkUserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: 'fkUserId_fkRoleId_unique',
        references: {
          model: {
            tableName: 'users',
            key: 'id',
          },
        },
        onDelete: 'CASCADE',
      },
      fkRoleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: 'fkUserId_fkRoleId_unique',
        references: {
          model: {
            tableName: 'roles',
            key: 'id',
          },
        },
      }
    },
    {
      uniqueKeys: {
        fkUserId_fkRoleId_unique: {
          customIndex: true,
          fields: ['fkRoleId', 'fkUserId'],
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('userRoles');
  }
};
