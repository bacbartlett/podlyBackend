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
   await queryInterface.bulkInsert("Podcasters", [
    {firstName: "Demo", lastName: "User", email: "demoP@user.com", hashedPassword: bcrypt.hashSync("password", 10), createdAt: new Date(), updatedAt: new Date()},
    {firstName: "Micah", lastName: "Long", email: "ML@user.com", hashedPassword: bcrypt.hashSync("password", 10), createdAt: new Date(), updatedAt: new Date()},
  ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
