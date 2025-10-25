'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
      id: { type: Sequelize.UUID, allowNull: false },
      booking_id: { type: Sequelize.UUID, allowNull: false },
      amount: { type: Sequelize.DECIMAL, allowNull: false },
      status: { type: Sequelize.ENUM('completed', 'pending', 'refunded'), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('payments');
  }
};
