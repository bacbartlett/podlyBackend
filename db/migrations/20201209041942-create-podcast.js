'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Podcasts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      podcasterId: {
        allowNull:false,
        references:{model: "Podcasters"},
        type: Sequelize.INTEGER
      },
      photoUrl:{
        allowNull: false,
        type: Sequelize.STRING(400)
      },
      name: {
        allowNull:false,
        type: Sequelize.STRING(200)
      },
      genreId: {
        type: Sequelize.INTEGER
      },
      rssFeedUrl: {
        type: Sequelize.STRING(400)
      },
      dynamoUrl: {
        type: Sequelize.STRING(200)
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
    await queryInterface.dropTable('Podcasts');
  }
};