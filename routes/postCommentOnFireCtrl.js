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
  onFirePostComment: async (req, res) => {
    // Getting auth header
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);

    // Control token
    if (userId < 0) return res.status(400).json({ error: "wrong token" });

    // Params
    const postCommentId = parseInt(req.params.postCommentId);

    // Control params post comment id
    if (postCommentId <= 0) {
      return res.status(400).json({ error: "invalid parameters" });
    }

    // Init variables
    let postCommentFound = null;
    let userFound = null;
    let userAlreadyLikedFound = null;
    let onFireCounter = null;
    let coldCounter = null;

    // Search post comment
    try {
      postCommentFound = await models.PostComment.findOne({
        where: { id: postCommentId },
      });
    } catch (err) {
      return res.status(500).json({ error: "unable to verify post comment" });
    }

    // If post comment found, update counters
    if (postCommentFound) {
      onFireCounter = postCommentFound.onFireCounter;
      coldCounter = postCommentFound.coldCounter;
      try {
        // Search post comment
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
        userAlreadyLikedFound = await models.PostCommentOnFire.findOne({
          where: {
            userId: userId,
            postCommentId: postCommentId,
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
          await postCommentFound.addUser(userFound, {
            isLike: LIKED,
          });

          try {
            // Search if user Already Liked Found
            userAlreadyLikedFound = await models.PostCommentOnFire.findOne({
              where: {
                userId: userId,
                postCommentId: postCommentId,
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
            postCommentId,
            false
          );
          try {
            // Update cold counter
            await postCommentFound.update({
              coldCounter: coldCounter,
              averageCounter: averageCounter,
              popularityCounter: popularityCounter,
            });
          } catch (err) {
            return res
              .status(500)
              .json({ error: "cannot update post comment cold counter" });
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
          postCommentId,
          false
        );
        try {
          // Update counter on fire
          await postCommentFound.update({
            onFireCounter: onFireCounter,
            averageCounter: averageCounter,
            popularityCounter: popularityCounter,
          });
        } catch (err) {
          return res
            .status(500)
            .json({ error: "cannot update post comment on fire counter" });
        }

        if (postCommentFound) {
          // If everything is alright, return response
          const response = {
            post: {
              posterId: postCommentFound.postUserId,
              postId: postCommentId,
              time: utils.timestampTranslator(postCommentFound.postTime),
            },
            profile: {
              _id: postCommentFound.userId,
              alias: postCommentFound.userAlias,
              urlPicture: postCommentFound.userUrlPicture,
            },
            time: utils.timestampTranslator(postCommentFound.createdAt),
            text: postCommentFound.commentText,
            coldCounter: postCommentFound.coldCounter,
            onFireCounter: postCommentFound.onFireCounter,
            averageCounter: postCommentFound.averageCounter,
            isLike: userAlreadyLikedFound.isLike,
            popularityCounter: postCommentFound.popularityCounter,
          };

          //return response
          return res.status(201).json(response);
        } else {
          return res.status(500).json({ error: "cannot update post comment" });
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
        // Update average counter & popularity counter & popularity counter
        let averageCounter = utils.averageCounter(onFireCounter, coldCounter);
        let popularityCounter = await utils.popularityCounter(
          onFireCounter,
          coldCounter,
          postCommentId,
          false
        );
        try {
          // Update on fire counter
          await postCommentFound.update({
            onFireCounter: onFireCounter,
            averageCounter: averageCounter,
            popularityCounter: popularityCounter,
          });
        } catch (err) {
          return res
            .status(500)
            .json({ error: "cannot update post comment on fire counter" });
        }

        if (postCommentFound) {
          // If everything is alright, prepare response
          const response = {
            post: {
              posterId: postCommentFound.postUserId,
              postId: postCommentId,
              time: utils.timestampTranslator(postCommentFound.postTime),
            },
            profile: {
              _id: postCommentFound.userId,
              alias: postCommentFound.userAlias,
              urlPicture: postCommentFound.userUrlPicture,
            },
            time: utils.timestampTranslator(postCommentFound.createdAt),
            text: postCommentFound.commentText,
            coldCounter: postCommentFound.coldCounter,
            onFireCounter: postCommentFound.onFireCounter,
            averageCounter: postCommentFound.averageCounter,
            isLike: userAlreadyLikedFound.isLike,
            popularityCounter: postCommentFound.popularityCounter,
          };

          //return response
          return res.status(201).json(response);
        } else {
          return res.status(500).json({ error: "cannot update post comment" });
        }
      } else {
        res.status(409).json({
          error: "error with post comment isLike",
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
  coldPostComment: async (req, res) => {
    // Getting auth header
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);

    // Control token
    if (userId < 0) return res.status(400).json({ error: "wrong token" });

    // Params
    //ou query à la place de parmas
    const postCommentId = parseInt(req.params.postCommentId);

    // Control params post comment id
    if (postCommentId <= 0) {
      return res.status(400).json({ error: "invalid parameters" });
    }

    // Init variables
    let postCommentFound = null;
    let userFound = null;
    let userAlreadyLikedFound = null;
    let onFireCounter = null;
    let coldCounter = null;

    try {
      // Search post comment
      postCommentFound = await models.PostComment.findOne({
        where: { id: postCommentId },
      });
    } catch (err) {
      return res.status(500).json({ error: "unable to verify post comment" });
    }

    // If post comment found, update counters
    if (postCommentFound) {
      coldCounter = postCommentFound.coldCounter;
      onFireCounter = postCommentFound.onFireCounter;
      try {
        // Search post comment
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
        userAlreadyLikedFound = await models.PostCommentOnFire.findOne({
          where: {
            userId: userId,
            postCommentId: postCommentId,
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
          await postCommentFound.addUser(userFound, {
            isLike: DISLIKED,
          });

          try {
            // Search if user Already Liked Found
            userAlreadyLikedFound = await models.PostCommentOnFire.findOne({
              where: {
                userId: userId,
                postCommentId: postCommentId,
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
            postCommentId,
            false
          );
          try {
            // Update on fire counter
            await postCommentFound.update({
              onFireCounter: onFireCounter,
              averageCounter: averageCounter,
              popularityCounter: popularityCounter,
            });
          } catch (err) {
            return res
              .status(500)
              .json({ error: "cannot update post comment cold counter" });
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
          postCommentId,
          false
        );
        try {
          // Update counter on fire
          await postCommentFound.update({
            coldCounter: coldCounter,
            averageCounter: averageCounter,
            popularityCounter: popularityCounter,
          });
        } catch (err) {
          return res
            .status(500)
            .json({ error: "cannot update post comment on fire counter" });
        }

        if (postCommentFound) {
          // If everything is alright, prepare response
          const response = {
            post: {
              posterId: postCommentFound.postUserId,
              postId: postCommentId,
              time: utils.timestampTranslator(postCommentFound.postTime),
            },
            profile: {
              _id: postCommentFound.userId,
              alias: postCommentFound.userAlias,
              urlPicture: postCommentFound.userUrlPicture,
            },
            time: utils.timestampTranslator(postCommentFound.createdAt),
            text: postCommentFound.commentText,
            coldCounter: postCommentFound.coldCounter,
            onFireCounter: postCommentFound.onFireCounter,
            averageCounter: postCommentFound.averageCounter,
            isLike: userAlreadyLikedFound.isLike,
            popularityCounter: postCommentFound.popularityCounter,
          };

          //return response
          return res.status(201).json(response);
        } else {
          return res.status(500).json({ error: "cannot update post comment" });
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
          postCommentId,
          false
        );
        try {
          // Update cold counter
          await postCommentFound.update({
            coldCounter: coldCounter,
            averageCounter: averageCounter,
            popularityCounter: popularityCounter,
          });
        } catch (err) {
          return res.status(500).json({
            error: "cannot update post comment on fire counter",
          });
        }

        if (postCommentFound) {
          // If everything is alright, prepare response
          const response = {
            post: {
              posterId: postCommentFound.postUserId,
              postId: postCommentId,
              time: utils.timestampTranslator(postCommentFound.postTime),
            },
            profile: {
              _id: postCommentFound.userId,
              alias: postCommentFound.userAlias,
              urlPicture: postCommentFound.userUrlPicture,
            },
            time: utils.timestampTranslator(postCommentFound.createdAt),
            text: postCommentFound.commentText,
            coldCounter: postCommentFound.coldCounter,
            onFireCounter: postCommentFound.onFireCounter,
            averageCounter: postCommentFound.averageCounter,
            isLike: userAlreadyLikedFound.isLike,
            popularityCounter: postCommentFound.popularityCounter,
          };

          //return response
          return res.status(201).json(response);
        } else {
          return res.status(500).json({ error: "cannot update post comment" });
        }
      } else {
        res.status(409).json({
          error: "error with post comment isLike",
        });
      }
    } else {
      return res
        .status(500)
        .json({ error: "unable to verify is user already liked" });
    }
  },
};
