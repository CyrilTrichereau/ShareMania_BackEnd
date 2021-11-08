// Imports
const jwtUtils = require("../utils/jwt.utils");
const utils = require("../utils/utils");
const models = require("../models");

// Constants
const DISLIKED = -1;
const NOLIKE = 0;
const LIKED = 1;

// Routes
module.exports = {
  onFireFeedPost: async (req, res) => {
    // Getting auth header
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);

    // Control token
    if (userId < 0) return res.status(400).json({ error: "wrong token" });

    // Params
    const feedPostId = parseInt(req.params.feedPostId);

    // Control params feed post id
    if (feedPostId <= 0) {
      return res.status(400).json({ error: "invalid parameters" });
    }

    // Init variables
    let feedPostFound = null;
    let userFound = null;
    let userAlreadyLikedFound = null;
    let onFireCounter = null;
    let coldCounter = null;

    // Search feed post
    try {
      feedPostFound = await models.FeedPost.findOne({
        where: { id: feedPostId },
      });
    } catch (err) {
      return res.status(500).json({ error: "unable to verify feed post" });
    }

    // If feed post found, update counters
    if (feedPostFound) {
      onFireCounter = feedPostFound.onFireCounter;
      coldCounter = feedPostFound.coldCounter;
      try {
        // Search user
        userFound = await models.User.findOne({
          where: { id: userId },
        });
      } catch (err) {
        return res.status(500).json({ error: "unable to verify user" });
      }
    } else {
      res.status(404).json({ error: "post doesn't exist" });
    }
    // If user found
    if (userFound) {
      try {
        // Search if user Already Liked Found
        userAlreadyLikedFound = await models.FeedPostOnFire.findOne({
          where: {
            userId: userId,
            feedPostId: feedPostId,
          },
        });
      } catch (err) {
        return res
          .status(500)
          .json({ error: "unable to verify is user already liked" });
      }
      // If user Already Liked didn't exist
      if (!userAlreadyLikedFound) {
        try {
          // Create a new user Already Liked
          await feedPostFound.addUser(userFound, {
            isLike: LIKED,
          });

          try {
            // Search if user Already Liked Found
            userAlreadyLikedFound = await models.FeedPostOnFire.findOne({
              where: {
                userId: userId,
                feedPostId: feedPostId,
              },
            });
          } catch (err) {
            return res.status(500).json({
              error: "unable to verify is user already liked after create user",
            });
          }
        } catch (err) {
          return res.status(500).json({ error: "unable to create user" });
        }
      }

      if (
        userAlreadyLikedFound.isLike === DISLIKED ||
        userAlreadyLikedFound.isLike === NOLIKE
      ) {
        if (!onFireCounter) {
          // If onFireCounter doesn't exist, set at 1
          onFireCounter = 1;
        } else {
          // Else increment
          onFireCounter++;
        }
        if (userAlreadyLikedFound.isLike === DISLIKED) {
          // Decrement cold counter
          coldCounter--;
          // Update average counter
          let averageCounter = utils.averageCounter(onFireCounter, coldCounter);
          let popularityCounter = await utils.popularityCounter(
            onFireCounter,
            coldCounter,
            feedPostId,
            true
          );
          try {
            // Update cold counter
            await feedPostFound.update({
              coldCounter: coldCounter,
              averageCounter: averageCounter,
              popularityCounter: popularityCounter,
            });
          } catch (err) {
            return res
              .status(500)
              .json({ error: "cannot update feed post cold counter" });
          }
        }
        try {
          // Update isLike from userAlreadyLikedFound
          await userAlreadyLikedFound.update({
            isLike: LIKED,
          });
        } catch (err) {
          return res.status(500).json({ error: "cannot update user reaction" });
        }
        // Update average counter & popularity counter
        let averageCounter = utils.averageCounter(onFireCounter, coldCounter);
        let popularityCounter = await utils.popularityCounter(
          onFireCounter,
          coldCounter,
          feedPostId,
          true
        );
        try {
          // Update counter on fire
          await feedPostFound.update({
            onFireCounter: onFireCounter,
            averageCounter: averageCounter,
            popularityCounter: popularityCounter,
          });
        } catch (err) {
          return res
            .status(500)
            .json({ error: "cannot update feed post on fire counter" });
        }

        if (feedPostFound) {
          // If everything is alright, prepare response
          const response = {
            posterProfile: {
              alias: feedPostFound.userAlias,
              urlPicture: feedPostFound.userUrlPicture,
              service: feedPostFound.userService,
              _id: feedPostFound.id,
            },
            time: utils.timestampTranslator(feedPostFound.createdAt),
            content: {
              text: feedPostFound.contentText,
              urlPicture: feedPostFound.contentUrlPicture,
              originalPosterProfile: {
                alias: feedPostFound.originalUserAlias,
                urlPicture: feedPostFound.originalUserUrlPicture,
                text: feedPostFound.originalUserText,
              },
            },
            onFireCounter: feedPostFound.onFireCounter,
            coldCounter: feedPostFound.coldCounter,
            averageCounter: feedPostFound.averageCounter,
            isLike: userAlreadyLikedFound.isLike,
            popularityCounter: feedPostFound.popularityCounter,
          };

          //return response
          return res.status(201).json(response);
        } else {
          return res.status(500).json({ error: "cannot update feed post" });
        }
      } else if (userAlreadyLikedFound.isLike === LIKED) {
        // Decrement cold counter
        onFireCounter--;
        try {
          // Update isLike from userAlreadyLikedFound
          await userAlreadyLikedFound.update({
            isLike: NOLIKE,
          });
        } catch (err) {
          return res.status(500).json({ error: "cannot update user reaction" });
        }
        // Update average counter & popularity counter
        let averageCounter = utils.averageCounter(onFireCounter, coldCounter);
        let popularityCounter = await utils.popularityCounter(
          onFireCounter,
          coldCounter,
          feedPostId,
          true
        );
        try {
          // Update on fire counter
          await feedPostFound.update({
            onFireCounter: onFireCounter,
            averageCounter: averageCounter,
            popularityCounter: popularityCounter,
          });
        } catch (err) {
          return res
            .status(500)
            .json({ error: "cannot update feed post on fire counter" });
        }

        if (feedPostFound) {
          // If everything is alright, prepare response
          const response = {
            posterProfile: {
              alias: feedPostFound.userAlias,
              urlPicture: feedPostFound.userUrlPicture,
              service: feedPostFound.userService,
              _id: feedPostFound.id,
            },
            time: utils.timestampTranslator(feedPostFound.createdAt),
            content: {
              text: feedPostFound.contentText,
              urlPicture: feedPostFound.contentUrlPicture,
              originalPosterProfile: {
                alias: feedPostFound.originalUserAlias,
                urlPicture: feedPostFound.originalUserUrlPicture,
                text: feedPostFound.originalUserText,
              },
            },
            onFireCounter: feedPostFound.onFireCounter,
            coldCounter: feedPostFound.coldCounter,
            averageCounter: feedPostFound.averageCounter,
            isLike: userAlreadyLikedFound.isLike,
            popularityCounter: feedPostFound.popularityCounter,
          };

          //return response
          return res.status(201).json(response);
        } else {
          return res.status(500).json({ error: "cannot update feed post" });
        }
      } else {
        res.status(409).json({
          error: "error with feed post isLike",
        });
      }
    } else {
      return res
        .status(500)
        .json({ error: "unable to verify is user already liked" });
    }
  },

  // ------------------------
  // ------------------------
  // ------------------------
  coldFeedPost: async (req, res) => {
    // Getting auth header
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);

    // Control token
    if (userId < 0) return res.status(400).json({ error: "wrong token" });

    // Params
    const feedPostId = parseInt(req.params.feedPostId);

    // Control params feed post id
    if (feedPostId <= 0) {
      return res.status(400).json({ error: "invalid parameters" });
    }

    // Init variables
    let feedPostFound = null;
    let userFound = null;
    let userAlreadyLikedFound = null;
    let onFireCounter = null;
    let coldCounter = null;

    try {
      // Search feed post
      feedPostFound = await models.FeedPost.findOne({
        where: { id: feedPostId },
      });
    } catch (err) {
      return res.status(500).json({ error: "unable to verify feed post" });
    }

    // If feed post found, update counters
    if (feedPostFound) {
      coldCounter = feedPostFound.coldCounter;
      onFireCounter = feedPostFound.onFireCounter;
      try {
        // Search feed post
        userFound = await models.User.findOne({
          where: { id: userId },
        });
      } catch (err) {
        return res.status(500).json({ error: "unable to verify user" });
      }
    } else {
      res.status(404).json({ error: "post doesn't exist" });
    }
    // If user found
    if (userFound) {
      try {
        // Search if user Already Liked Found
        userAlreadyLikedFound = await models.FeedPostOnFire.findOne({
          where: {
            userId: userId,
            feedPostId: feedPostId,
          },
        });
      } catch (err) {
        return res
          .status(500)
          .json({ error: "unable to verify is user already liked" });
      }
      // If user Already Liked didn't exist
      if (!userAlreadyLikedFound) {
        try {
          // Create a new user Already Liked
          await feedPostFound.addUser(userFound, {
            isLike: DISLIKED,
          });

          try {
            // Search if user Already Liked Found
            userAlreadyLikedFound = await models.FeedPostOnFire.findOne({
              where: {
                userId: userId,
                feedPostId: feedPostId,
              },
            });
          } catch (err) {
            return res.status(500).json({
              error: "unable to verify is user already liked after create user",
            });
          }
        } catch (err) {
          return res.status(500).json({ error: "unable to create user" });
        }
      }

      if (
        userAlreadyLikedFound.isLike === LIKED ||
        userAlreadyLikedFound.isLike === NOLIKE
      ) {
        if (!coldCounter) {
          // If coldCounter doesn't exist, set at 1
          coldCounter = 1;
        } else {
          // Else increment
          coldCounter++;
        }
        if (userAlreadyLikedFound.isLike === LIKED) {
          // Decrement on fire counter
          onFireCounter--;
          // Update average counter
          let averageCounter = utils.averageCounter(onFireCounter, coldCounter);
          let popularityCounter = await utils.popularityCounter(
            onFireCounter,
            coldCounter,
            feedPostId,
            true
          );
          try {
            // Update on fire counter
            await feedPostFound.update({
              onFireCounter: onFireCounter,
              averageCounter: averageCounter,
              popularityCounter: popularityCounter,
            });
          } catch (err) {
            return res
              .status(500)
              .json({ error: "cannot update feed post cold counter" });
          }
        }
        try {
          // Update isLike from userAlreadyLikedFound
          await userAlreadyLikedFound.update({
            isLike: DISLIKED,
          });
        } catch (err) {
          return res.status(500).json({ error: "cannot update user reaction" });
        }
        // Update average counter & popularity counter
        let averageCounter = utils.averageCounter(onFireCounter, coldCounter);
        let popularityCounter = await utils.popularityCounter(
          onFireCounter,
          coldCounter,
          feedPostId,
          true
        );
        try {
          // Update counter on fire
          await feedPostFound.update({
            coldCounter: coldCounter,
            averageCounter: averageCounter,
            popularityCounter: popularityCounter,
          });
        } catch (err) {
          return res
            .status(500)
            .json({ error: "cannot update feed post on fire counter" });
        }

        if (feedPostFound) {
          // If everything is alright, prepare response
          const response = {
            posterProfile: {
              alias: feedPostFound.userAlias,
              urlPicture: feedPostFound.userUrlPicture,
              service: feedPostFound.userService,
              _id: feedPostFound.id,
            },
            time: utils.timestampTranslator(feedPostFound.createdAt),
            content: {
              text: feedPostFound.contentText,
              urlPicture: feedPostFound.contentUrlPicture,
              originalPosterProfile: {
                alias: feedPostFound.originalUserAlias,
                urlPicture: feedPostFound.originalUserUrlPicture,
                text: feedPostFound.originalUserText,
              },
            },
            onFireCounter: feedPostFound.onFireCounter,
            coldCounter: feedPostFound.coldCounter,
            averageCounter: feedPostFound.averageCounter,
            isLike: userAlreadyLikedFound.isLike,
            popularityCounter: feedPostFound.popularityCounter,
          };

          //return response
          return res.status(201).json(response);
        } else {
          return res.status(500).json({ error: "cannot update feed post" });
        }
      } else if (userAlreadyLikedFound.isLike === DISLIKED) {
        // Decrement cold counter
        coldCounter--;
        try {
          // Update isLike from userAlreadyLikedFound
          await userAlreadyLikedFound.update({
            isLike: NOLIKE,
          });
        } catch (err) {
          return res.status(500).json({ error: "cannot update user reaction" });
        }
        // Update average counter & popularity counter
        let averageCounter = utils.averageCounter(onFireCounter, coldCounter);
        let popularityCounter = await utils.popularityCounter(
          onFireCounter,
          coldCounter,
          feedPostId,
          true
        );
        try {
          // Update cold counter
          await feedPostFound.update({
            coldCounter: coldCounter,
            averageCounter: averageCounter,
            popularityCounter: popularityCounter,
          });
        } catch (err) {
          return res
            .status(500)
            .json({ error: "cannot update feed post on fire counter" });
        }

        if (feedPostFound) {
          // If everything is alright, prepare response
          const response = {
            posterProfile: {
              alias: feedPostFound.userAlias,
              urlPicture: feedPostFound.userUrlPicture,
              service: feedPostFound.userService,
              _id: feedPostFound.id,
            },
            time: utils.timestampTranslator(feedPostFound.createdAt),
            content: {
              text: feedPostFound.contentText,
              urlPicture: feedPostFound.contentUrlPicture,
              originalPosterProfile: {
                alias: feedPostFound.originalUserAlias,
                urlPicture: feedPostFound.originalUserUrlPicture,
                text: feedPostFound.originalUserText,
              },
            },
            onFireCounter: feedPostFound.onFireCounter,
            coldCounter: feedPostFound.coldCounter,
            averageCounter: feedPostFound.averageCounter,
            isLike: userAlreadyLikedFound.isLike,
            popularityCounter: feedPostFound.popularityCounter,
          };

          //return response
          return res.status(201).json(response);
        } else {
          return res.status(500).json({ error: "cannot update feed post" });
        }
      } else {
        res.status(409).json({
          error: "error with feed post isLike",
        });
      }
    } else {
      return res
        .status(500)
        .json({ error: "unable to verify is user already liked" });
    }
  },
};
