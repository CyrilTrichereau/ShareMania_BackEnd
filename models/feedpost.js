"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FeedPost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.FeedPost.hasMany(models.PostComment);
      models.FeedPost.hasMany(models.FeedPostOnFire);
      models.FeedPost.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
        },
        onDelete: "cascade",
        hooks: true,
      });
    }
  }
  FeedPost.init(
    {
      userAlias: DataTypes.STRING,
      userUrlPicture: DataTypes.STRING,
      userService: DataTypes.STRING,
      contentText: DataTypes.STRING,
      contentUrlPicture: DataTypes.STRING,
      originalUserAlias: DataTypes.STRING,
      originalUserUrlPicture: DataTypes.STRING,
      originalUserText: DataTypes.TEXT,
      onFireCounter: DataTypes.INTEGER,
      coldCounter: DataTypes.INTEGER,
      averageCounter: DataTypes.INTEGER,
      popularityCounter: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "FeedPost",
    }
  );
  return FeedPost;
};
