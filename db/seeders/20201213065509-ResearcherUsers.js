'use strict';
const bcrypt = require("bcryptjs")

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
   await queryInterface.bulkInsert("Researchers", [
    {email: "demoR@user.com", hashedPassword: bcrypt.hashSync("password", 10), createdAt: new Date(), updatedAt: new Date()},
    {email: "ML@user.com", hashedPassword: bcrypt.hashSync("password", 10), createdAt: new Date(), updatedAt: new Date()},
  ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Researchers", null)
  }
};
 