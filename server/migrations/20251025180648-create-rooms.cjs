'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rooms', {
      id: { type: Sequelize.UUID, allowNull: false },
      hotel_id: { type: Sequelize.UUID, allowNull: false },
      room_number: { type: Sequelize.INTEGER, allowNull: false },
      type: { type: Sequelize.ENUM('single', 'double', 'suite') },
      price: { type: Sequelize.DECIMAL, allowNull: false },
      is_available: { type: Sequelize.BOOLEAN, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('rooms');
  }
};
