"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(models.FeedPost);
      models.User.hasOne(models.ForgottenPassword);
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      alias: DataTypes.STRING,
      password: DataTypes.STRING,
      service: DataTypes.STRING,
      urlPicture: DataTypes.STRING,
      isModerator: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
