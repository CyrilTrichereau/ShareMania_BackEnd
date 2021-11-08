"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PostCommentOnFire extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.belongsToMany(models.PostComment, {
        through: models.PostCommentOnFire,
        foreignKey: "userId",
        otherKey: "postCommentId",
        onDelete: "cascade",
        hooks: true,
      });

      models.PostComment.belongsToMany(models.User, {
        through: models.PostCommentOnFire,
        foreignKey: "postCommentId",
        otherKey: "userId",
        onDelete: "cascade",
        hooks: true,
      });

      models.PostCommentOnFire.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
        onDelete: "cascade",
        hooks: true,
      });

      models.PostCommentOnFire.belongsTo(models.PostComment, {
        foreignKey: "postCommentId",
        as: "postComment",
        onDelete: "cascade",
        hooks: true,
      });
    }
  }
  PostCommentOnFire.init(
    {
      postCommentId: {
        type: DataTypes.INTEGER,
        references: {
          model: "PostComment",
          key: "id",
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "id",
        },
      },
      isLike: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PostCommentOnFire",
    }
  );
  return PostCommentOnFire;
};
