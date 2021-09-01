// Imports
const models = require("../models");
const jwtUtils = require("../utils/jwt.utils");
const utils = require("../utils/utils");

// Constants
const CONTENT_TEXT_LIMIT = 4;
const ITEMS_LIMIT = 50;

// Routes
module.exports = {
  createPostComment: async (req, res) => {
    // Getting auth header
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);

    // Params
    const postUserId = req.body.post.posterId;
    const feedPostId = req.body.post.postId;
    const postTime = req.body.post.time;
    const user_Id = req.body.profile._id;
    const userAlias = req.body.profile.alias;
    const userUrlPicture = req.body.profile.urlPicture;
    const commentText = req.body.text;

    // If One information is missing
    if (
      !postUserId ||
      !feedPostId ||
      !postTime ||
      !user_Id ||
      !userAlias ||
      !userUrlPicture ||
      !commentText
    ) {
      return res.status(400).json({ error: "missing parameters" });
    }

    // If the content text is too small
    if (commentText.length <= CONTENT_TEXT_LIMIT) {
      return res.status(400).json({ error: "invalid parameters" });
    }

    let feedPostFound = null;
    let newPost = null;

    try {
      // Search feed post
      feedPostFound = await models.FeedPost.findOne({
        where: { id: feedPostId },
      });
    } catch (err) {
      return res.status(500).json({ error: "unable to find post" });
    }

    if (feedPostFound) {
      // If feed post is found, create a new comment

      try {
        newPost = await models.PostComment.create({
          postUserId: postUserId,
          FeedPostId: feedPostId,
          postTime: postTime,
          userId: user_Id,
          userAlias: userAlias,
          userUrlPicture: userUrlPicture,
          commentText: commentText,
        });
      } catch (err) {
        return res.status(500).json({ error: "unable to create comment" });
      }
      // if post is well created, send newPost Object or send an error
      if (newPost) {
        // Prepare response
        const newPostObject = {
          _id: newPost.id,
          time: utils.timestampTranslator(newPost.createdAt),
          text: newPost.commentText,
          onFireCounter: null,
          coldCounter: null,
          isLike: null,
          post: {
            posterId: newPost.postUserId,
            postId: newPost.FeedPostId,
            time: utils.timestampTranslator(newPost.postTime),
          },
          profile: {
            _id: newPost.userId,
            alias: newPost.userAlias,
            urlPicture: newPost.userUrlPicture,
          },
        };
        // Return response
        return res.status(201).json(newPostObject);
      } else {
        return res.status(500).json({ error: "cannot post message" });
      }
    } else {
      res.status(404).json({ error: "user not found" });
    }
  },

  // ------------------------
  // ------------------------
  // ------------------------
  listPostComment: async (req, res) => {
    const fields = req.query.fields;
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const order = req.query.order;

    if (limit > ITEMS_LIMIT) {
      limit = ITEMS_LIMIT;
    }

    // Search for all comments, with get options (fields, order, limit and offset)
    let commentsList = null;
    try {
      // Search feed post
      commentsList = await models.PostComment.findAll({
        order: [order != null ? order.split(":") : ["createdAt", "DESC"]],
        attributes: fields !== "*" && fields != null ? fields.split(",") : null,
        limit: !isNaN(limit) ? limit : null,
        offset: !isNaN(offset) ? offset : null,
        include: [
          {
            model: models.PostCommentOnFire,
            attributes: ["isLike"],
          },
        ],
      });
    } catch (err) {
      return res.status(500).json({ error: "unable to get post comments" });
    }

    // if list of comment is not false
    if (commentsList) {
      // Prepare response
      let listComments = [];

      commentsList.forEach(async (comment) => {
        let isLike = null;
        if (!comment.PostCommentOnFires) {
          isLike = comment.PostCommentOnFires[0].isLike;
        }
        const commentObject = {
          _id: comment.id,
          time: utils.timestampTranslator(comment.createdAt),
          text: comment.commentText,
          onFireCounter: comment.onFireCounter,
          coldCounter: comment.coldCounter,
          isLike: isLike,
          post: {
            posterId: comment.postUserId,
            postId: comment.FeedPostId,
            time: utils.timestampTranslator(comment.postTime),
          },
          profile: {
            _id: comment.userId,
            alias: comment.userAlias,
            urlPicture: comment.userUrlPicture,
          },
        };
        listComments.push(commentObject);
      });

      // Return response
      res.status(200).json(listComments);
    } else {
      res.status(404).json({ error: "no comments found" });
    }
  },

  deletePostComment: async (req, res) => {
    // Getting auth header
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);

    // Control token
    if (userId < 0) return res.status(400).json({ error: "wrong token" });

    // Params
    const postCommentIdFromParams = parseInt(req.params.postCommentId);

    // Control params feed post id
    if (postCommentIdFromParams <= 0) {
      return res.status(400).json({ error: "invalid parameters" });
    }

    let userFound = null;
    let postCommentFound = null;

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
      postCommentFound = await models.PostComment.findOne({
        attributes: [
          "id",
          "postUserId",
          "feedPostId",
          "userAlias",
          "commentText",
        ],
        where: { id: postCommentIdFromParams },
      });
    } catch (err) {
      return res.status(500).json({ error: "cannot fetch feed post" + err });
    }
        
    if (!postCommentFound) {
      return res.status(500).json({ error: "cannot fetch post comment"});
    }
    if (
      userFound.isModerator === true ||
      userFound.id === postCommentFound.postUserId
    ) {
      try {
        // Search user with id and get this attributes list
        await models.PostComment.destroy({
          where: { id: postCommentFound.id },
        });
      } catch (err) {
        return res.status(500).json({ error: "cannot destroy feed post" });
      }

      // Prepare response
      const postCommentErased = {
        _id: postCommentFound.id,
        post: {
          posterId: postCommentFound.postUserId,
          postId: postCommentFound.FeedPostId,
        },
        profile: {
          alias: postCommentFound.userAlias,
        },
        text: postCommentFound.commentText,
      };

      return res
        .status(200)
        .json({ message: "Feed post erased", postCommentErased });
    } else {
      return res.status(500).json({ error: "access denied" });
    }
  },
};