'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('refreshSessions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fkUserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: 'users',
            key: 'id',
          },
        },
        onDelete: 'CASCADE',
      },
      refreshToken: {
        type: Sequelize.STRING(500),
        allowNull: false,
        unique: true
      },
      userAgent: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      fingerprint: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      expiresIn: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.BIGINT,
        allowNull: false,
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('refreshSessions');
  }
};
