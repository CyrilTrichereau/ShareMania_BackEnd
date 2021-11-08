"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("PostComments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      postUserId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      feedPostId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "FeedPosts",
          key: "id",
        },
        onDelete: "cascade",
      },
      postTime: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      userId: {
        allowNull: false,
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
      commentText: {
        allowNull: false,
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
    await queryInterface.dropTable("PostComments");
  },
};
