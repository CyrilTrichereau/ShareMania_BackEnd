"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("FeedPosts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userAlias: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      userUrlPicture: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      userService: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "cascade",
      },
      contentText: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      contentUrlPicture: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      originalUserAlias: {
        type: Sequelize.STRING,
      },
      originalUserUrlPicture: {
        type: Sequelize.STRING,
      },
      originalUserText: {
        type: Sequelize.TEXT,
      },
      onFireCounter: {
        type: Sequelize.INTEGER,
      },
      coldCounter: {
        type: Sequelize.INTEGER,
      },
      averageCounter: {
        type: Sequelize.INTEGER,
        defaultValue: null,
      },
      popularityCounter: {
        type: Sequelize.INTEGER,
        defaultValue: null,
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
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("FeedPosts");
  },
};
