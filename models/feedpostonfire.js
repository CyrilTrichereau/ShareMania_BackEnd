"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FeedPostOnFire extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.belongsToMany(models.FeedPost, {
        through: models.FeedPostOnFire,
        foreignKey: "userId",
        otherKey: "feedPostId",
        onDelete: "cascade",
        hooks: true,
      });

      models.FeedPost.belongsToMany(models.User, {
        through: models.FeedPostOnFire,
        foreignKey: "feedPostId",
        otherKey: "userId",
        onDelete: "cascade",
        hooks: true,
      });

      models.FeedPostOnFire.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
        onDelete: "cascade",
        hooks: true,
      });

      models.FeedPostOnFire.belongsTo(models.FeedPost, {
        foreignKey: "feedPostId",
        as: "feedPost",
        onDelete: "cascade",
        hooks: true,
      });
    }
  }
  FeedPostOnFire.init(
    {
      feedPostId: {
        type: DataTypes.INTEGER,
        references: {
          model: "FeedPost",
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
      modelName: "FeedPostOnFire",
    }
  );
  return FeedPostOnFire;
};
