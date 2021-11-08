// Imports
const models = require("../models");

// Exported functions
module.exports = {
  timestampTranslator: (value) => {
    return value.getTime() / 1000;
  },
  averageCounter: (onFireCounter, coldCounter) => {
    if (!onFireCounter && !coldCounter) {
      return null;
    } else if (!onFireCounter) {
      return 0;
    } else if (!coldCounter) {
      return 100;
    } else {
      return Math.round(onFireCounter / ((onFireCounter + coldCounter) / 100));
    }
  },

  // Set index popularity : 5pts for every like/unlike and 10pts for a comment
  popularityCounter: async (onFireCounter, coldCounter, id, isFeedPost) => {
    let popularityCounterResponse = 0;
    let postComment = null;
    let listComments = null;

    // If id is valid and if it is a feedPost
    if (id && isFeedPost) {
      // Find post comments lists
      try {
        listComments = await models.PostComment.findAll({
          attributes: ["id"],
          where: { FeedPostId: id },
        });
      } catch (err) {
        return { error: err };
      }
      // --- Then Calculate popularity ---
      // For every cold vote add 5 points
      if (coldCounter) {
        popularityCounterResponse += coldCounter * 5;
      }
      // For every onFire vote add 10 points
      if (onFireCounter) {
        popularityCounterResponse += onFireCounter * 10;
      }
      // For every comment add 15 points
      if (listComments.length) {
        popularityCounterResponse += listComments.length * 15;
      }
      // Return value of popularity
      return popularityCounterResponse;
    } else if (id && !isFeedPost) {
      // If id is valid and if it is a post comment
      // --- Then Calculate popularity ---
      // For every cold vote add 5 points
      if (coldCounter) {
        popularityCounterResponse += coldCounter * 5;
      }
      // For every onFire vote add 10 points
      if (onFireCounter) {
        popularityCounterResponse += onFireCounter * 10;
      }

      // Return value of popularity
      return popularityCounterResponse;
    } else {
      console.log({ error: "Invalid params" });
    }
  },
};
