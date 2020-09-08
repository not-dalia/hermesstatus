'use strict';
module.exports = (sequelize, DataTypes) => {
  const tweet = sequelize.define('tweet', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    tweetId: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    userId: {
      type: DataTypes.STRING
    },
    user: {
      type: DataTypes.STRING
    },
    tweet: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    sentiment: {
      type: DataTypes.DOUBLE,
      defaultValue: 0
    },
    date: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {});
  tweet.associate = function(models) {
    // associations can be defined here
  };
  return tweet;
};