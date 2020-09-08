'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tweets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tweetId: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      userId: {
        type: Sequelize.STRING
      },
      user: {
        type: Sequelize.STRING
      },
      tweet: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      sentiment: {
        type: Sequelize.DOUBLE
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tweets');
  }
};