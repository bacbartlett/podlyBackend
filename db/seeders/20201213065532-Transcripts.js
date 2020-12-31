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
     {title: "opprobrium", transcriberId: 1, status: 4, link: "https://wisproject.s3.us-east-2.amazonaws.com/1608678367566", podcastId: 1, dynamoUrl: "https://s3.us-east-2.amazonaws.com/wisjson/transcribed1609420933899.json", createdAt: new Date(), updatedAt: new Date()},
     {title: "efficacious", status: 2, link: "https://wisproject.s3.us-east-2.amazonaws.com/1608835476775", podcastId: 1, dynamoUrl: "https://s3.us-east-2.amazonaws.com/wisjson/custom1608835602575.json", createdAt: new Date(), updatedAt: new Date()},
     {title: "franchise", status: 2, link: "https://wisproject.s3.us-east-2.amazonaws.com/1609094442638", podcastId: 1, dynamoUrl: "https://s3.us-east-2.amazonaws.com/wisjson/custom1609094616225.json", createdAt: new Date(), updatedAt: new Date()},
     {title: "convalesce", transcriberId: 1, status: 4, link: "https://wisproject.s3.us-east-2.amazonaws.com/1609404628583", podcastId: 1, dynamoUrl: "https://s3.us-east-2.amazonaws.com/wisjson/transcribed1609421836461.json", createdAt: new Date(), updatedAt: new Date()},
     {title: "Science News Briefs from around the Planet", status: 2, link: "https://wisproject.s3.us-east-2.amazonaws.com/1609415620091", podcastId: 2, dynamoUrl: "https://s3.us-east-2.amazonaws.com/wisjson/custom1609415746061.json", createdAt: new Date(), updatedAt: new Date()},
     {title: "Baby Bees Deprive Caregivers of Sleep", transcriberId: 1, status: 4, link: "https://wisproject.s3.us-east-2.amazonaws.com/1609415630832", podcastId: 2, dynamoUrl: "https://s3.us-east-2.amazonaws.com/wisjson/transcribed1609422309979.json", createdAt: new Date(), updatedAt: new Date()},
     {title: "Ravens Measure Up to Great Apes on Intelligence", status: 2, link: "https://wisproject.s3.us-east-2.amazonaws.com/1609422664646", podcastId: 2, dynamoUrl: "https://s3.us-east-2.amazonaws.com/wisjson/custom1609422790944.json", createdAt: new Date(), updatedAt: new Date()},

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
