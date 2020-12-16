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
   await queryInterface.bulkInsert("Transcripts",[
     {title: "flout", status: 2, link: "https://wisproject.s3.us-east-2.amazonaws.com/1607843740473", podcastId: 1, dynamoUrl: "https://s3.us-east-2.amazonaws.com/wisjson/custom1607843868147.json", createdAt: new Date(), updatedAt: new Date()}
   ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Transcripts", null)
  }
};
