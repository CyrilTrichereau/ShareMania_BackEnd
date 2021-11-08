"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PostComment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.PostComment.hasMany(models.PostCommentOnFire);
      models.PostComment.belongsTo(models.FeedPost, {
        foreignKey: {
          allowNull: false,
        },
        onDelete: "cascade",
        hooks: true,
      });
    }
  }
  PostComment.init(
    {
      postUserId: DataTypes.INTEGER,
      postTime: DataTypes.DATE,
      userId: DataTypes.INTEGER,
      userAlias: DataTypes.STRING,
      userUrlPicture: DataTypes.STRING,
      commentText: DataTypes.TEXT,
      onFireCounter: DataTypes.INTEGER,
      coldCounter: DataTypes.INTEGER,
      averageCounter: DataTypes.INTEGER,
      popularityCounter: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PostComment",
    }
  );
  return PostComment;
};
