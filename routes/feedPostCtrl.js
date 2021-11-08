// Imports
const fs = require("fs");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const models = require("../models");
const jwtUtils = require("../utils/jwt.utils");
const utils = require("../utils/utils");

// Constants
const CONTENT_TEXT_LIMIT = 6;
const ITEMS_LIMIT = 50;

// Routes
module.exports = {
  createFeedPost: async (req, res) => {
    try {
      const feedPostObject = req.body;

      if (req.file) {
        feedPostObject.contentUrlPicture = `${req.protocol}://${req.get(
          "host"
        )}/mediaPostsStore/${req.file.filename}`;
      }
      // Getting auth header
      const headerAuth = req.headers["authorization"];
      const userId = jwtUtils.getUserId(headerAuth);

      // Params
      const userAlias = feedPostObject.userAlias;
      const userUrlPicture = feedPostObject.userUrlPicture;
      const userService = feedPostObject.userService;
      const contentText = feedPostObject.contentText;
      const contentUrlPicture = feedPostObject.contentUrlPicture;
      const originalUserAlias = feedPostObject.originalUserAlias;
      const originalUserUrlPicture = feedPostObject.originalUserUrlPicture;
      const originalUserText = feedPostObject.originalUserText;

      // If One information isLike missing
      if (
        userAlias == null ||
        userUrlPicture == null ||
        userService == null ||
        contentText == null ||
        userUrlPicture == null
      ) {
        return res.status(400).json({ error: "missing parameters" });
      }

      // If the content text isLike too small
      if (contentText.length <= CONTENT_TEXT_LIMIT) {
        return res.status(400).json({ error: "invalid parameters" });
      }

      let userFound = null;
      let newPost = null;

      // Search the user
      try {
        userFound = await models.User.findOne({
          where: { id: userId },
        });
      } catch (err) {
        return res.status(500).json({ error: "unable to verify user" });
      }

      if (userFound) {
        // If usier isfound, create a new post with comments
        try {
          newPost = await models.FeedPost.create({
            userAlias: userAlias,
            userUrlPicture: userUrlPicture,
            userService: userService,
            UserId: userId,
            contentText: contentText,
            contentUrlPicture: contentUrlPicture,
            originalUserAlias: originalUserAlias,
            originalUserUrlPicture: originalUserUrlPicture,
            originalUserText: originalUserText,
          });
        } catch (err) {
          return res.status(500).json({ error: "unable to create feed post" });
        }

        // if post isLike well created, send newPost Object or send an error
        if (newPost) {
          // Prepare response
          const response = {
            _id: newPost.id,
            time: utils.timestampTranslator(newPost.createdAt),
            onFireCounter: null,
            coldCounter: null,
            averageCounter: 0,
            popularityCounter: 0,
            posterProfile: {
              alias: newPost.userAlias,
              urlPicture: newPost.userUrlPicture,
              service: newPost.userService,
              _id: newPost.UserId,
            },
            content: {
              text: newPost.contentText,
              urlPicture: newPost.contentUrlPicture,
              originalPosterProfile: {
                alias: newPost.originalUserAlias,
                urlPicture: newPost.originalUserUrlPicture,
                text: newPost.originalUserText,
              },
            },
          };
          // Return response
          return res.status(201).json(response);
        } else {
          return res.status(500).json({ error: "cannot post message" });
        }
      } else {
        res.status(404).json({ error: "user not found" });
      }
    } catch (err) {
      return res.status(500).json({ error: "global error: " });
    }
  },

  // ------------------------
  // ------------------------
  // ------------------------
  listFeedPost: async (req, res) => {
    // Getting auth header
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);

    // Control token
    if (userId < 0) return res.status(400).json({ error: "wrong token" });

    // Params
    const fields = req.query.fields;
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const order = req.query.order;

    if (limit > ITEMS_LIMIT) {
      limit = ITEMS_LIMIT;
    }

    let listFeedPosts = null;

    // Search for all posts, with get options (fields, order, limit and offset)
    try {
      listFeedPosts = await models.FeedPost.findAll({
        order: [order != null ? order.split(":") : ["createdAt", "DESC"]],

        attributes: fields !== "*" && fields != null ? fields.split(",") : null,

        limit: !isNaN(limit) ? limit : null,
        offset: !isNaN(offset) ? offset : null,
        where: {
          createdAt: {
            [Op.lte]: new Date()
          },
        },
        include: [
          {
            model: models.FeedPostOnFire,
            attributes: ["isLike", "userId"],
          },
        ],
      });
    } catch (err) {
      return res.status(500).json({ error: "invalid fields" });
    }
    // If feed posts found
    if (listFeedPosts) {
      // Prepare response
      let response = [];
      // Loop for organise data for response
      listFeedPosts.forEach((feedPost) => {
        // Find if user isLike this feed post
        let isLike = 0;
        feedPost.FeedPostOnFires.forEach((userLikeRow) => {
          if (userLikeRow.userId === userId) {
            if (userLikeRow.isLike === 1 || userLikeRow.isLike === -1) {
              isLike = userLikeRow.isLike;
              return;
            }
          }
        });
        const feedPostObject = {
          _id: feedPost.id,
          posterProfile: {
            alias: feedPost.userAlias,
            urlPicture: feedPost.userUrlPicture,
            service: feedPost.userService,
            _id: feedPost.UserId,
          },
          time: utils.timestampTranslator(feedPost.createdAt),
          content: {
            text: feedPost.contentText,
            urlPicture: feedPost.contentUrlPicture,
            originalPosterProfile: {
              alias: feedPost.originalUserAlias,
              urlPicture: feedPost.originalUserUrlPicture,
              text: feedPost.originalUserText,
            },
          },
          onFireCounter: feedPost.onFireCounter,
          coldCounter: feedPost.coldCounter,
          averageCounter: feedPost.averageCounter,
          isLike: isLike,
          popularityCounter: feedPost.popularityCounter,
        };
        response.push(feedPostObject);
      });
      if (response) {
        return res.status(200).json(response);
      } else {
        return res.status(404).json({ error: "Cannot prepare response" });
      }
    } else {
      return res.status(404).json({ error: "no feed post found" });
    }
  },

  deleteFeedPost: async (req, res) => {
    // Getting auth header
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);

    // Control token
    if (userId < 0) return res.status(400).json({ error: "wrong token" });

    // Params
    const feedPostIdFromParams = parseInt(req.params.feedPostId);

    // Control params feed post id
    if (feedPostIdFromParams <= 0) {
      return res.status(400).json({ error: "invalid parameters" });
    }

    let userFound = null;
    let feedPostFound = null;

    try {
      // Search user with id and get IsModerator
      userFound = await models.User.findOne({
        where: { id: userId },
      });
    } catch (err) {
      return res.status(500).json({ error: "cannot fetch user" });
    }

    try {
      // Search feed post with id and get this attributes list
      feedPostFound = await models.FeedPost.findOne({
        attributes: [
          "id",
          "userAlias",
          "userService",
          "userId",
          "contentText",
          "originalUserAlias",
          "contentUrlPicture",
        ],
        where: { id: feedPostIdFromParams },
        include: [
          {
            model: models.User,
            attributes: ["id"],
          },
        ],
      });
    } catch (err) {
      return res.status(500).json({ error: "cannot fetch feed post" });
    }
    if (
      userFound.isModerator === true ||
      userFound.id === feedPostFound.User.id
    ) {
      try {
        // Destroy media attached
        const filename =
          feedPostFound.contentUrlPicture.split("/mediaPostsStore/")[1];
        fs.unlink(`mediaPostsStore/${filename}`, async () => {
          // Destroy feed post with id
          await models.FeedPost.destroy({
            where: { id: feedPostFound.id },
          });
        });
      } catch (err) {
        return res.status(500).json({ error: "cannot destroy feed post" });
      }
      // Prepare response
      let response = {
        _id: feedPostFound.id,
        posterProfile: {
          alias: feedPostFound.userAlias,
          service: feedPostFound.userService,
          _id: feedPostFound.UserId,
        },
        content: {
          text: feedPostFound.contentText,
          originalPosterProfile: {
            alias: feedPostFound.originalUserAlias,
          },
        },
      };
      // Return response
      return res
        .status(200)
        .json({ message: "Feed post erased", feedPostErased: response });
    } else {
      return res.status(500).json({ error: "access denied" });
    }
  },
};
