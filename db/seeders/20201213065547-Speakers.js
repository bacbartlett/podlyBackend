'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert("Speakers", [
     {transcriptId: 1, name: "Narrator", createdAt: new Date(), updatedAt: new Date()},
     {transcriptId: 1, name: "Ad Reader", createdAt: new Date(), updatedAt: new Date()},
     {transcriptId: 1, name: "Outro Voice", createdAt: new Date(), updatedAt: new Date()},
   ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Speakers", null)
  }
};
