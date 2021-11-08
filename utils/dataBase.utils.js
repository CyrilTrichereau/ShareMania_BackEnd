// Imports
const models = require("../models");
const bcrypt = require("bcrypt");
const CryptoJS = require("crypto-js");
const fakeFeedPosts = require("./feedPosts.fakeDataBase.js");
const fakeUsers = require("./users.fakeDataBase.js");
const utils = require("../utils/utils");

// Functions

// GET RANDOM NUMBER BETWEEN
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

// GET AN ARRAY OF UNIQUE RANDOM NUMBER BETWEEN
const getArrayOfUniqueRandomInt = (
  howMuchIterate,
  addBeforeNumber,
  min,
  max
) => {
  let counter = 0;
  let arrayOfRandomNumbers = [];
  while (counter !== howMuchIterate) {
    const randomNumber = getRandomInt(min, max);
    if (!searchNumber(arrayOfRandomNumbers, randomNumber)) {
      arrayOfRandomNumbers.push(addBeforeNumber + randomNumber);
      counter++;
    }
  }
  return arrayOfRandomNumbers;
};

// SEARCH A NUMBER IN AN ARRAY
const searchNumber = (array, number) => {
  const found = array.find((num) => num === number);
  if (found >= 0) {
    return true;
  } else {
    return false;
  }
};

// Exported functions
module.exports = {
  isDataBase: async () => {
    const listUsers = await models.User.findAll({
      attributes: ["id"],
    });
    const listFeedPosts = await models.FeedPost.findAll({
      attributes: ["id"],
    });
    const listPostComments = await models.PostComment.findAll({
      attributes: ["id"],
    });
    if (
      !listUsers.length &&
      !listFeedPosts.length &&
      !listPostComments.length
    ) {
      return false;
    } else {
      return true;
    }
  },
  // ------------------------
  // ------------------------
  // ------------------------
  // ------------------------
  // ------------------------
  injectFakeUsers: async () => {
    fakeUsers.users.forEach(async (user) => {
      let newUser = null;
      // Crypt email
      let emailEncrypted = null;
      try {
        emailEncrypted = CryptoJS.AES.encrypt(
          user.email,
          process.env.CRYPTO_JS_KEY
        ).toString();
      } catch (err) {
        console.log({ error: "Cannot crypt email" });
      }

      // Crypt password and create user
      await bcrypt.hash(user.password, 5, async (error, bcryptedPassword) => {
        try {
          newUser = await models.User.create({
            email: emailEncrypted,
            alias: user.alias,
            password: bcryptedPassword,
            service: user.service,
            urlPicture: user.urlPicture,
            isModerator: user.isModerator,
          });
        } catch (err) {
          console.log("Cannot create add users ");
        }
        // if user is well create, send message or send an error
        if (!newUser) {
          console.log("User cannot be create");
          return;
        }
        try {
          // Change createAt
          newUser.changed("createdAt", true);
          newUser.set("createdAt", user.createdAt, { raw: true });
          await newUser.save({
            silent: true,
            fields: ["createdAt"],
          });
        } catch (err) {
          console.log("Cannot update user ");
        }
      });
    });
  },
  // ------------------------
  // ------------------------
  // ------------------------
  // ------------------------
  // ------------------------
  injectFakeFeedPostsAndComments: () => {
    try {
      fakeFeedPosts.feedPosts.forEach(async (feedPostObject) => {
        // Params
        const userId = feedPostObject.posterProfile._id;
        const userAlias = feedPostObject.posterProfile.alias;
        const userUrlPicture = feedPostObject.posterProfile.urlPicture;
        const userService = feedPostObject.posterProfile.service;
        const contentText = feedPostObject.content.text;
        const contentUrlPicture = feedPostObject.content.urlPicture;
        const originalUserAlias =
          feedPostObject.content.originalPosterProfile.alias;
        const originalUserUrlPicture =
          feedPostObject.content.originalPosterProfile.urlPicture;
        const originalUserText =
          feedPostObject.content.originalPosterProfile.text;

        let newPost = null;
        // create a new post with comments
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
          console.log({ error: "unable to create feed post" });
        }
        try {
          // Change createAt and updatedAt
          newPost.changed("createdAt", true);
          newPost.set("createdAt", feedPostObject.createdAt, { raw: true });
          await newPost.save({
            silent: true,
            fields: ["createdAt"],
          });
        } catch (err) {
          console.log("Cannot update user ");
        }
        if (newPost) {
          // Inject post comments
          setTimeout(() => {
            try {
              feedPostObject.commentsList.forEach(async (comment) => {
                // Params
                const feedPostId = newPost.id;
                const postTime = feedPostObject.createdAt;
                const postUserId = feedPostObject.posterProfile._id;
                const user_Id = comment.profile._id;
                const userAlias = comment.profile.alias;
                const userUrlPicture = comment.profile.urlPicture;
                const commentText = comment.text;

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
                  console.log({ error: "missing parameters" });
                }

                let newComment = null;

                try {
                  newComment = await models.PostComment.create({
                    postUserId: postUserId,
                    FeedPostId: feedPostId,
                    postTime: postTime,
                    userId: user_Id,
                    userAlias: userAlias,
                    userUrlPicture: userUrlPicture,
                    commentText: commentText,
                  });
                } catch (err) {
                  console.log({ error: "unable to create comment" });
                }
                // if post is well created
                if (newComment) {
                  try {
                    // Change createAt and updatedAt
                    newComment.changed("createdAt", true);
                    newComment.set("createdAt", comment.createdAt, {
                      raw: true,
                    });
                    await newComment.save({
                      silent: true,
                      fields: ["createdAt"],
                    });
                  } catch (err) {
                    console.log("Cannot update user ");
                  }
                } else {
                  console.log({ error: "cannot post message" });
                }
              });
            } catch (err) {
              console.log({ error: err });
            }
          }, 150);

          return;
        } else {
          console.log({ error: "cannot post message" });
        }
      });
    } catch (err) {
      console.log({ error: "global error: " });
    }
  },
  // ------------------------
  // ------------------------
  // ------------------------
  // ------------------------
  // ------------------------
  injectOnFireAndColdForFeedPosts: async () => {
    // Constants
    const DISLIKED = -1;
    const NOLIKE = 0;
    const LIKED = 1;
    try {
      // Init variables
      let feedPostsList = null;
      try {
        feedPostsList = await models.FeedPost.findAll();
      } catch (err) {
        console.log({ error: "error: " + err });
      }
      // If there is comments, loop for each
      if (feedPostsList) {
        feedPostsList.forEach(async (feedPost) => {
          // Params
          let feedPostId = feedPost.id;
          let howManyOnfire = getRandomInt(1, 25);
          let howManyCold = getRandomInt(1, 15);
          let arrayOfNumbers = getArrayOfUniqueRandomInt(
            howManyOnfire + howManyCold,
            0,
            1,
            40
          );
          let counter = 1;

          //--------------------
          //-------------------- Loop for make it on fire ----------------
          //--------------------

          while (counter !== howManyOnfire) {
            let userId = arrayOfNumbers[counter];

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
              console.log({ error: "unable to verify feed post" });
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
                console.log({ error: "unable to verify user" });
              }
            } else {
              console.log({ error: "post doesn't exist" });
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
                console.log({
                  error: "unable to verify is user already liked",
                });
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
                    userAlreadyLikedFound = await models.FeedPostOnFire.findOne(
                      {
                        where: {
                          userId: userId,
                          feedPostId: feedPostId,
                        },
                      }
                    );
                  } catch (err) {
                    console.log({
                      error:
                        "unable to verify is user already liked after create user",
                    });
                  }
                } catch (err) {
                  console.log({ error: "unable to create user" });
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
                  let averageCounter = utils.averageCounter(
                    onFireCounter,
                    coldCounter
                  );
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
                    console.log({
                      error: "cannot update feed post cold counter",
                    });
                  }
                }
                try {
                  // Update isLike from userAlreadyLikedFound
                  await userAlreadyLikedFound.update({
                    isLike: LIKED,
                  });
                } catch (err) {
                  console.log({ error: "cannot update user reaction" });
                }
                // Update average counter & popularity counter
                let averageCounter = utils.averageCounter(
                  onFireCounter,
                  coldCounter
                );
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
                  console.log({
                    error: "cannot update feed post on fire counter",
                  });
                }

                if (!feedPostFound) {
                  console.log({ error: "cannot update feed post" });
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
                  console.log({ error: "cannot update user reaction" });
                }
                // Update average counter & popularity counter
                let averageCounter = utils.averageCounter(
                  onFireCounter,
                  coldCounter
                );
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
                  console.log({
                    error: "cannot update feed post on fire counter",
                  });
                }

                if (!feedPostFound) {
                  console.log({ error: "cannot update feed post" });
                }
              } else {
                console.log({
                  error: "error with feed post isLike",
                });
              }
            } else {
              console.log({ error: "unable to verify is user already liked" });
            }

            counter++;
          }
          //--------------------
          //-------------------- Loop for make it cold ----------------
          //--------------------
          while (counter !== howManyOnfire + howManyCold) {
            let userId = arrayOfNumbers[counter];

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
              console.log({ error: "unable to verify feed post" });
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
                console.log({ error: "unable to verify user" });
              }
            } else {
              console.log({ error: "post doesn't exist" });
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
                console.log({
                  error: "unable to verify is user already liked",
                });
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
                    userAlreadyLikedFound = await models.FeedPostOnFire.findOne(
                      {
                        where: {
                          userId: userId,
                          feedPostId: feedPostId,
                        },
                      }
                    );
                  } catch (err) {
                    console.log({
                      error:
                        "unable to verify is user already liked after create user",
                    });
                  }
                } catch (err) {
                  console.log({ error: "unable to create user" });
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
                  let averageCounter = utils.averageCounter(
                    onFireCounter,
                    coldCounter
                  );
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
                    console.log({
                      error: "cannot update feed post cold counter",
                    });
                  }
                }
                try {
                  // Update isLike from userAlreadyLikedFound
                  await userAlreadyLikedFound.update({
                    isLike: DISLIKED,
                  });
                } catch (err) {
                  console.log({ error: "cannot update user reaction" });
                }
                // Update average counter & popularity counter
                let averageCounter = utils.averageCounter(
                  onFireCounter,
                  coldCounter
                );
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
                  console.log({
                    error: "cannot update feed post on fire counter",
                  });
                }

                if (!feedPostFound) {
                  console.log({ error: "cannot update feed post" });
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
                  console.log({ error: "cannot update user reaction" });
                }
                // Update average counter & popularity counter
                let averageCounter = utils.averageCounter(
                  onFireCounter,
                  coldCounter
                );
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
                  console.log({
                    error: "cannot update feed post on fire counter",
                  });
                }

                if (feedPostFound) {
                  console.log({ error: "cannot update feed post" });
                }
              } else {
                console.log({
                  error: "error with feed post isLike",
                });
              }
            } else {
              console.log({ error: "unable to verify is user already liked" });
            }

            counter++;
          }
        });
      } else {
        console.log(
          "------------ Cannot find all list comments --------------------"
        );
      }
    } catch (err) {
      console.log({ error: "global error: " + err });
    }
  },
  // ------------------------
  // ------------------------
  // ------------------------
  // ------------------------
  // ------------------------
  injectOnFireAndColdForPostComments: async () => {
    // Constants
    const DISLIKED = -1;
    const NOLIKE = 0;
    const LIKED = 1;
    try {
      // Init variables
      let postCommentsList = null;
      try {
        postCommentsList = await models.PostComment.findAll();
      } catch (err) {
        console.log({ error: "global error: " + err });
      }
      // If there is comments, loop for each
      if (postCommentsList) {
        postCommentsList.forEach(async (postComment) => {
          // Params
          let postCommentId = postComment.id;
          let howManyOnfire = getRandomInt(1, 25);
          let howManyCold = getRandomInt(1, 15);
          let arrayOfNumbers = getArrayOfUniqueRandomInt(
            howManyOnfire + howManyCold,
            0,
            1,
            40
          );
          let counter = 1;

          //--------------------
          //-------------------- Loop for make it on fire ----------------
          //--------------------
          while (counter !== howManyOnfire) {
            let userId = arrayOfNumbers[counter];

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
              console.log({ error: "unable to verify post comment" });
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
                console.log({ error: "unable to verify user" });
              }
            } else {
              console.log({ error: "post doesn't exist" });
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
                console.log({
                  error: "unable to verify is user already liked",
                });
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
                    userAlreadyLikedFound =
                      await models.PostCommentOnFire.findOne({
                        where: {
                          userId: userId,
                          postCommentId: postCommentId,
                        },
                      });
                  } catch (err) {
                    console.log({
                      error:
                        "unable to verify is user already liked after create user",
                    });
                  }
                } catch (err) {
                  console.log({ error: "unable to create user" });
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
                  let averageCounter = utils.averageCounter(
                    onFireCounter,
                    coldCounter
                  );
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
                    console.log({
                      error: "cannot update post comment cold counter",
                    });
                  }
                }
                try {
                  // Update isLike from userAlreadyLikedFound
                  await userAlreadyLikedFound.update({
                    isLike: LIKED,
                  });
                } catch (err) {
                  console.log({ error: "cannot update user reaction" });
                }
                // Update average counter & popularity counter
                let averageCounter = utils.averageCounter(
                  onFireCounter,
                  coldCounter
                );
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
                  console.log({
                    error: "cannot update post comment on fire counter",
                  });
                }

                if (!postCommentFound) {
                  console.log(
                    "------------- Error with updating -------------------"
                  );
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
                  console.log({ error: "cannot update user reaction" });
                }
                // Update average counter & popularity counter & popularity counter
                let averageCounter = utils.averageCounter(
                  onFireCounter,
                  coldCounter
                );
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
                  console.log({
                    error: "cannot update post comment on fire counter",
                  });
                }

                if (!postCommentFound) {
                  console.log(
                    "------------- Error with updating -------------------"
                  );
                }
              } else {
                console.log({
                  error: "error with post comment isLike",
                });
              }
            } else {
              console.log({ error: "unable to verify is user already liked" });
            }

            counter++;
          }
          //--------------------
          //-------------------- Loop for make it cold ----------------
          //--------------------
          while (counter !== howManyOnfire + howManyCold) {
            let userId = arrayOfNumbers[counter];
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
              console.log({ error: "unable to verify post comment" });
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
                console.log({ error: "unable to verify user" });
              }
            } else {
              console.log({ error: "post doesn't exist" });
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
                console.log({
                  error: "unable to verify is user already liked",
                });
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
                    userAlreadyLikedFound =
                      await models.PostCommentOnFire.findOne({
                        where: {
                          userId: userId,
                          postCommentId: postCommentId,
                        },
                      });
                  } catch (err) {
                    console.log({
                      error:
                        "unable to verify is user already liked after create user",
                    });
                  }
                } catch (err) {
                  console.log({ error: "unable to create user" });
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
                  let averageCounter = utils.averageCounter(
                    onFireCounter,
                    coldCounter
                  );
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
                    console.log({
                      error: "cannot update post comment cold counter",
                    });
                  }
                }
                try {
                  // Update isLike from userAlreadyLikedFound
                  await userAlreadyLikedFound.update({
                    isLike: DISLIKED,
                  });
                } catch (err) {
                  console.log({ error: "cannot update user reaction" });
                }
                // Update average counter & popularity counter
                let averageCounter = utils.averageCounter(
                  onFireCounter,
                  coldCounter
                );
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
                  console.log({
                    error: "cannot update post comment on fire counter",
                  });
                }

                if (!postCommentFound) {
                  console.log(
                    "------------- Error with updating -------------------"
                  );
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
                  console.log({ error: "cannot update user reaction" });
                }
                // Update average counter & popularity counter
                let averageCounter = utils.averageCounter(
                  onFireCounter,
                  coldCounter
                );
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
                  console.log({
                    error: "cannot update post comment on fire counter",
                  });
                }

                if (!postCommentFound) {
                  console.log(
                    "------------- Error with updating -------------------"
                  );
                }
              } else {
                console.log({
                  error: "error with post comment isLike",
                });
              }
            } else {
              console.log({ error: "unable to verify is user already liked" });
            }

            counter++;
          }
        });
      } else {
        console.log(
          "------------ Cannot find all list comments --------------------"
        );
      }
    } catch (err) {
      console.log({ error: "global error: " + err });
    }
  },
};
