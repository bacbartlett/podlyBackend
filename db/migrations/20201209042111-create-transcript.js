'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Transcripts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title:{
        allowNull: false,
        type: Sequelize.STRING(200),
      },
      length:{
        allowNull: true,
        type: Sequelize.INTEGER
      },
      status: {
        allowNull:false,
        type: Sequelize.INTEGER
      },
      link: {
        allowNull:false,
        type: Sequelize.STRING(200)
      },
      podcastId: {
        allowNull:false,
        references:{model: "Podcasts"},
        type: Sequelize.INTEGER
      },
      transcriberId: {
        allowNull:true,
        references:{model: "Transcribers"},
        type: Sequelize.INTEGER
      },
      dynamoUrl: {
        allowNull: true,
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
    await queryInterface.dropTable('Transcripts');
  }
};