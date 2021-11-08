"use strict";

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

    // foreach user in array
    return queryInterface.bulkInsert("Users", [
      {
        urlPicture: "/mediaPostsStore/maleProfile12.jpg",
        alias: "YvesAllard85",
        isModerator: false,
        service: "Informatique",
        email: "YvesAllard85@gmail.com",
        password: "Azerty123+",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
