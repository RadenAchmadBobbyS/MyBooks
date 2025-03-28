'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Periksa apakah kolom sudah ada sebelum menambahkannya
    const tableDescription = await queryInterface.describeTable('Books');
    if (!tableDescription.imgUrl) {
      await queryInterface.addColumn('Books', 'imgUrl', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Books', 'imgUrl');
  },
};