'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Licenses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      imageName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      authorName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      authorPhoneNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      authorEmail: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      authorAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdBy: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addConstraint('Licenses', {
      fields: ['createdBy'], // Tên cột trong bảng Licenses
      type: 'foreign key',
      name: 'fk_user_license', // Tên cho ràng buộc khóa ngoại
      references: {
        table: 'Users', // Tên bảng bạn muốn tham chiếu đến
        field: 'id', // Tên trường khóa chính trong bảng Users
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Licenses');
  },
};
