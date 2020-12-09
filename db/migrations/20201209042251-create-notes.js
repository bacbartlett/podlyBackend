'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Notes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      researcherId: {
        allowNull:false,
        references: {model:"Researchers"},
        type: Sequelize.INTEGER
      },
      transcriptId: {
        allowNull:false,
        references: {model:"Transcripts"},
        type: Sequelize.INTEGER
      },
      beginningTime: {
        allowNull:false,
        type: Sequelize.INTEGER
      },
      endingTime: {
        allowNull:false,
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Notes');
  }
};