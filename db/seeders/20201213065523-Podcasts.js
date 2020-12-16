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
      await queryInterface.bulkInsert("Podcasts", [
        {podcasterId: 1, photoUrl: "https://content.production.cdn.art19.com/images/c1/b5/63/4e/c1b5634e-bd8e-4b84-8342-7d23cb651428/a3da77c0bd2fd448abe80c2fc8d5ccfe15952b72382c528175f7da888822f7b7cb8ce8a34e3352036d9c38322cd022f26f0f2f9e0d2f3cec9c3e649498bb259b.jpeg", name: "Merriam-Webster's Word of the Day", rssFeedUrl: "https://rss.art19.com/merriam-websters-word-of-the-day", createdAt: new Date(), updatedAt: new Date()},
        {podcasterId: 1, photoUrl: "https://static.scientificamerican.com/sciam/cache/file/42C04BF1-2ED5-44D9-A29114A15A9BDF42_source.jpg", name: "60-Second Science", rssFeedUrl: "http://rss.sciam.com/sciam/60secsciencepodcast?format=xml", createdAt: new Date(), updatedAt: new Date()},
        {podcasterId: 1, photoUrl: "https://pbcdn1.podbean.com/imglogo/image-logo/5306974/Screen_Shot_2020-09-11_at_13056_PM9suto.png", name: "The Biblical Mind", rssFeedUrl: "https://feed.podbean.com/centerforhebraicthought/feed.xml", createdAt: new Date(), updatedAt: new Date()},
      ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Podcasts", null)
  }
};
