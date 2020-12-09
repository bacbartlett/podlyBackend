'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Transcribers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        allowNull:false,
        type: Sequelize.STRING(50)
      },
      lastName: {
        allowNull:false,
        type: Sequelize.STRING(50)
      },
      email: {
        unique: true,
        allowNull:false,
        type: Sequelize.STRING(100)
      },
      hashedPassword: {
        type: Sequelize.STRING.BINARY
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Transcribers');
  }
};