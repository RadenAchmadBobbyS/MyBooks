'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const users = require('../data/user.json').map(el => {
      el.createdAt = el.updatedAt = new Date()
      return el
    });

    const books = require('../data/book.json').map(el => {
      el.createdAt = el.updatedAt = new Date()
      return el
    });

    const favorites = require('../data/favorite.json').map(el => {
      el.createdAt = el.updatedAt = new Date()
      return el
    });

    const purchases = require('../data/purchase.json').map(el => {
      el.createdAt = el.updatedAt = el.paymentDate = new Date()
      return el
    });

    await queryInterface.bulkInsert('Users', users);
    await queryInterface.bulkInsert('Books', books);
    await queryInterface.bulkInsert('Favorites', favorites);
    await queryInterface.bulkInsert('Purchases', purchases);  
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null);
    await queryInterface.bulkDelete('Books', null);
    await queryInterface.bulkDelete('Favorites', null);
    await queryInterface.bulkDelete('Purchases', null);
  }
};
