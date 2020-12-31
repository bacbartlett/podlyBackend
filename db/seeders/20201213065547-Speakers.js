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
     {transcriptId: 1, name: "Outro Voice", createdAt: new Date(), updatedAt: new Date()},
     {transcriptId: 2, name: "Narrator", createdAt: new Date(), updatedAt: new Date()},
     {transcriptId: 2, name: "Outro Voice", createdAt: new Date(), updatedAt: new Date()},
     {transcriptId: 3, name: "Narrator", createdAt: new Date(), updatedAt: new Date()},
     {transcriptId: 3, name: "Outro Voice", createdAt: new Date(), updatedAt: new Date()},
     {transcriptId: 4, name: "Narrator", createdAt: new Date(), updatedAt: new Date()},
     {transcriptId: 4, name: "Outro Voice", createdAt: new Date(), updatedAt: new Date()},
     {transcriptId: 6, name: "Ad Reader", createdAt: new Date(), updatedAt: new Date()},
     {transcriptId: 6, name: "Karen Hopkin", createdAt: new Date(), updatedAt: new Date()},
     {transcriptId: 6, name: "Moshe Nigari", createdAt: new Date(), updatedAt: new Date()},
     {transcriptId: 7, name: "Ad Reader", createdAt: new Date(), updatedAt: new Date()},
     {transcriptId: 7, name: "Christopher Intagliata", createdAt: new Date(), updatedAt: new Date()},
     {transcriptId: 7, name: "Zemo Topeka", createdAt: new Date(), updatedAt: new Date()},
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
