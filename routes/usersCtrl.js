// Imports
const bcrypt = require("bcrypt");
const fs = require("fs");
const jwtUtils = require("../utils/jwt.utils");
const CryptoJS = require("crypto-js");
const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
const utils = require("../utils/utils");
const models = require("../models");
const resetYourPassword = require("../utils/ResetYourPassword.email.js");
const confirmNewPassword = require("../utils/ConfirmNewPassword.email.js");
const confirmInscription = require("../utils/ConfirmInscription.email.js");
const confirmEraseProfile = require("../utils/ConfirmEraseProfile.email.js");
const confirmChanges = require("../utils/ConfirmChanges.email.js");
const notRegistered = require("../utils/notRegistered.email");

// Constants - REGEX
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const PASSWORD_REGEX =
  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[+=,;.\-])([a-zA-Z0-9+=,;.\-]){8,20}$/;
const ALIAS_REGEX = /^[a-zA-ZÀ-ÿ1-9]{5,12}$/;

// Routes
module.exports = {
  register: async (req, res) => {
    let userObject = req.body;
    // Params
    const email = userObject.email;
    const alias = userObject.alias;
    const password = userObject.password;
    const service = userObject.service;
    let urlPicture = userObject.urlPicture;
    const isModerator = false;

    // If One information is missing
    if (
      email == null ||
      alias == null ||
      password == null ||
      service == null ||
      urlPicture == null ||
      isModerator == null
    ) {
      return res.status(400).json({ error: "missing parameters" });
    }

    if (req.file) {
      urlPicture = `${req.protocol}://${req.get("host")}/mediaPostsStore/${
        req.file.filename
      }`;
    }

    // Control data sent with REGEX
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: "Email is not valid" });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({ error: "Password is not valid" });
    }

    if (!ALIAS_REGEX.test(alias)) {
      return res.status(400).json({ error: "Alias is not valid" });
    }

    let emailFound = null;
    let aliasFound = null;
    let newUser = null;
    let emailFoundDecrypted = null;

    // If alias does not exist, search all users email
    try {
      emailFound = await models.User.findAll({
        attributes: ["email"],
      });
    } catch (err) {
      return res.status(500).json({ error: "unable to verify user" });
    }

    // Loop in array for decrypt and compare email
    try {
      emailFound.forEach((emailFound) => {
        const emailFoundDecryptedRaw = CryptoJS.AES.decrypt(
          emailFound,
          process.env.CRYPTO_JS_KEY
        );
        emailFoundDecrypted = emailFoundDecryptedRaw.toString(
          CryptoJS.enc.Utf8
        );
        if (emailFoundDecrypted === email) {
          return res.status(409).json({ error: "Email already use" });
        }
      });
    } catch (err) {
      return res.status(500).json({ error: "Cannot crypt email" });
    }

    try {
      // If email not exist, search if alias already exist
      aliasFound = await models.User.findOne({
        attributes: ["alias"],
        where: { alias: alias },
      });
    } catch (err) {
      return res.status(500).json({ error: "unable to verify alias" });
    }
    if (!aliasFound) {
      // If alias does not exist, encrypt email,
      let emailEncrypted = null;
      try {
        emailEncrypted = CryptoJS.AES.encrypt(
          email,
          process.env.CRYPTO_JS_KEY
        ).toString();
      } catch (err) {
        return res.status(500).json({ error: "Cannot crypt email" });
      }
      // crypt password and create user
      bcrypt.hash(password, 5, async (error, bcryptedPassword) => {
        try {
          newUser = await models.User.create({
            email: emailEncrypted,
            alias: alias,
            password: bcryptedPassword,
            service: service,
            urlPicture: urlPicture,
            isModerator: isModerator,
          });
        } catch (err) {
          return res.status(500).json({ error: "Cannot add user" });
        }
        // if user is well create
        if (newUser) {
          // Send an email to confirm inscription to ShareMania
          try {
            // Prepare email
            let emailToSend = confirmInscription.email({
              emailToSend: email,
            });
            // Send email
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            let response = await sgMail.send(emailToSend);
            console.log({ message: "email sent !", response: response });
          } catch (err) {
            return res.status(500).json({ error: "Cannot send email" });
          }
          // Prepare response
          const newUserObject = {
            _id: newUser.id,
            token: jwtUtils.generateTokenForUser(newUser),
            email: newUser.email,
            alias: newUser.alias,
            service: newUser.service,
            urlPicture: newUser.urlPicture,
            time: utils.timestampTranslator(newUser.createdAt),
          };
          // Return new user object
          return res.status(201).json(newUserObject);
        } else {
          return res.status(500).json({ error: "Cannot add user" });
        }
      });
    } else {
      return res.status(409).json({ error: "Alias already use" });
    }
  },

  // ------------------------
  // ------------------------
  // ------------------------
  login: async (req, res) => {
    // Params
    const email = req.body.email;
    const password = req.body.password;

    // If One information is missing
    if (email == null || password == null) {
      return res.status(400).json({ error: "missing parameters" });
    }

    // Control data sent with REGEX
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: "Email is not valid" });
    }

    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({ error: "Password is not valid" });
    }

    // Search all users email
    let emailFound = null;
    try {
      emailFound = await models.User.findAll({
        attributes: ["email", "id"],
      });
    } catch (err) {
      return res.status(500).json({ error: "unable to verify user" });
    }

    // Loop in array for decrypt and compare email
    let emailFoundDecrypted = null;
    let idFound = null;
    try {
      emailFound.forEach((eachEmailFound) => {
        const emailFoundDecryptedRaw = CryptoJS.AES.decrypt(
          eachEmailFound.email,
          process.env.CRYPTO_JS_KEY
        );
        emailFoundDecrypted = emailFoundDecryptedRaw.toString(
          CryptoJS.enc.Utf8
        );
        if (emailFoundDecrypted === email) {
          idFound = eachEmailFound.id;
        }
      });
    } catch (err) {
      return res.status(500).json({ error: "Cannot crypt email" });
    }

    // Search if user with email adress
    let userFound = null;
    try {
      userFound = await models.User.findOne({
        where: { id: idFound },
      });
    } catch (err) {
      return res.status(500).json({ error: "unable to verify user" });
    }

    if (userFound) {
      // If user exist, compare password with userfound password
      bcrypt.compare(password, userFound.password, (errBcrypt, resBcrypt) => {
        if (resBcrypt) {
          //If passwords match, send back a token
          return res.status(200).json({
            userId: userFound.id,
            token: jwtUtils.generateTokenForUser(userFound),
          });
        } else {
          return res.status(400).json({ error: "Invalid password" });
        }
      });
    } else {
      return res.status(404).json({ error: "User not exist in db" });
    }
  },

  // ------------------------
  // ------------------------
  // ------------------------
  getUserProfile: async (req, res) => {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);

    // Control token
    if (userId < 0) return res.status(400).json({ error: "wrong token" });

    let userFound = null;

    try {
      // Search user with id and get this attributes list
      userFound = await models.User.findOne({
        attributes: [
          "id",
          "email",
          "alias",
          "service",
          "urlPicture",
          "isModerator",
        ],
        where: { id: userId },
      });
    } catch (err) {
      return res.status(500).json({ error: "cannot fetch user" });
    }

    if (userFound) {
      // if user found, decrypt email
      try {
        const emailFoundDecryptedRaw = CryptoJS.AES.decrypt(
          userFound.email,
          process.env.CRYPTO_JS_KEY
        );
        userFound.email = emailFoundDecryptedRaw.toString(CryptoJS.enc.Utf8);
      } catch (err) {
        return res.status(500).json({ error: "Cannot crypt email" });
      }

      // Then, send back all attributes
      res.status(201).json(userFound);
    } else {
      res.status(404).json({ error: "user not found" });
    }
  },

  // ------------------------
  // ------------------------
  // ------------------------
  updateUserProfile: async (req, res) => {
    // Getting auth header
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);

    // Params
    const alias = req.body.alias;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const service = req.body.service;
    let urlPicture = req.body.urlPicture;
    let userFound = null;
    let userFoundEmailDecrypted = null;

    try {
      // Search for User
      userFound = await models.User.findOne({
        attributes: [
          "id",
          "email",
          "alias",
          "password",
          "service",
          "urlPicture",
          "isModerator",
        ],
        where: { id: userId },
      });
    } catch (err) {
      return res.status(500).json({ error: "unable to verify user" });
    }
    if (userFound) {
      // Create url picture with file
      if (req.file) {
        urlPicture = `${req.protocol}://${req.get("host")}/mediaPostsStore/${
          req.file.filename
        }`;
      }
      // Decrypt email
      const userFoundEmailDecryptedRaw = CryptoJS.AES.decrypt(
        userFound.email,
        process.env.CRYPTO_JS_KEY
      );
      userFoundEmailDecrypted = userFoundEmailDecryptedRaw.toString(
        CryptoJS.enc.Utf8
      );

      // Then if user found, check if there is a password to change
      if (newPassword) {
        // Then if new password is not null, compare old password with password stored
        bcrypt.compare(
          oldPassword,
          userFound.password,
          (errBcrypt, resBcrypt) => {
            if (resBcrypt) {
              // If passwords match compare old password with new password
              if (newPassword == oldPassword) {
                return res.status(400).json({ error: "Same password" });
              } else {
                // If new password and old password are differents, crypt it
                bcrypt.hash(newPassword, 5, async (error, bcryptedPassword) => {
                  try {
                    if (req.file) {
                      // Destroy media attached
                      const filename =
                        userFound.urlPicture.split("/mediaPostsStore/")[1];
                      fs.unlink(`mediaPostsStore/${filename}`, async () => {
                        // Update profile with informations
                        userFound = await userFound.update({
                          alias: alias ? alias : userFound.alias,
                          password: bcryptedPassword
                            ? bcryptedPassword
                            : userFound.password,
                          service: service ? service : userFound.service,
                          urlPicture: urlPicture
                            ? urlPicture
                            : userFound.urlPicture,
                        });
                      });
                    } else {
                      // Update profile with informations
                      userFound = await userFound.update({
                        alias: alias ? alias : userFound.alias,
                        password: bcryptedPassword
                          ? bcryptedPassword
                          : userFound.password,
                        service: service ? service : userFound.service,
                        urlPicture: urlPicture
                          ? urlPicture
                          : userFound.urlPicture,
                      });
                    }
                  } catch (err) {
                    return res
                      .status(500)
                      .json({ error: "cannot update user" });
                  }
                  // Then send email and response with the profile data updated
                  if (userFound) {
                    try {
                      // Prepare email
                      let emailToSend = confirmChanges.email({
                        emailToSend: userFoundEmailDecrypted,
                      });
                      // Send email
                      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                      let response = await sgMail.send(emailToSend);
                      console.log({
                        message: "email sent !",
                        response: response,
                      });
                    } catch (err) {
                      return res
                        .status(500)
                        .json({ error: "Cannot send email" });
                    }

                    // Send response
                    return res.status(201).json({
                      _id: userFound.id,
                      email: userFound.email,
                      alias: userFound.alias,
                      service: userFound.service,
                      urlPicture: userFound.urlPicture,
                      isModerator: userFound.isModerator,
                    });
                  } else {
                    return res
                      .status(500)
                      .json({ error: "cannot update user profile" });
                  }
                });
              }
            } else {
              return res.status(400).json({ error: "Invalid password" });
            }
          }
        );
      } else {
        // else if there is no password to save, update others informations
        try {
          userFound = await userFound.update({
            alias: alias ? alias : userFound.alias,
            service: service ? service : userFound.service,
            urlPicture: urlPicture ? urlPicture : userFound.urlPicture,
          });
        } catch (err) {
          return res.status(500).json({ error: "cannot update user" });
        }
        // Then send email and response with the profile data updated
        if (userFound) {
          try {
            // Prepare email
            let emailToSend = confirmChanges.email({
              emailToSend: userFoundEmailDecrypted,
            });
            // Send email
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            let response = await sgMail.send(emailToSend);
            console.log({ message: "email sent !", response: response });
          } catch (err) {
            return res.status(500).json({ error: "Cannot send email" });
          }

          // Send response with the profile data updated
          return res.status(201).json({
            _id: userFound.id,
            alias: userFound.alias,
            service: userFound.service,
            urlPicture: userFound.urlPicture,
            isModerator: userFound.isModerator,
          });
        } else {
          return res.status(500).json({ error: "cannot update user profile" });
        }
      }
    } else {
      res.status(404).json({ error: "user not found" });
    }
  },
  deleteUserProfile: async (req, res) => {
    // Getting auth header
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);

    // Control token
    if (userId < 0) return res.status(400).json({ error: "wrong token" });

    // Params
    const userIdFromParams = parseInt(req.params.userId);

    // Control params feed post id
    if (userIdFromParams <= 0) {
      return res.status(400).json({ error: "invalid parameters" });
    }

    let userFound = null;
    try {
      // Search user with id and get this attributes list
      userFound = await models.User.findOne({
        attributes: [
          "id",
          "email",
          "alias",
          "service",
          "urlPicture",
          "isModerator",
        ],
        where: { id: userId },
      });
    } catch (err) {
      return res.status(500).json({ error: "cannot fetch user" });
    }

    // decrypt email
    let emailFoundDecrypted = null
    try {
      const emailFoundDecryptedRaw = CryptoJS.AES.decrypt(
        userFound.email,
        process.env.CRYPTO_JS_KEY
      );
      emailFoundDecrypted = emailFoundDecryptedRaw.toString(CryptoJS.enc.Utf8);
    } catch (err) {
      return res.status(500).json({ error: "Cannot crypt email" });
    }

    if (userFound.isModerator === true || userId === userIdFromParams) {
      try {
        // Destroy media attached
        const filename = userFound.urlPicture.split("/mediaPostsStore/")[1];
        fs.unlink(`mediaPostsStore/${filename}`, async () => {
          // Search user with id and get this attributes list;
          await models.User.destroy({
            where: { id: userId },
          });
        });
      } catch (err) {
        return res.status(500).json({ error: "cannot destroy user" });
      }

      // Send an email to confirm erasing and response
      try {
        // Prepare email
        let emailToSend = confirmEraseProfile.email({
          emailToSend: emailFoundDecrypted,
        });
        // Send email
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        let response = await sgMail.send(emailToSend);
        console.log({ message: "email sent !", response: response });
      } catch (err) {
        return res.status(500).json({ error: "Cannot send email" });
      }

      // Response
      return res.status(200).json({
        message: "Profile erased",
        userFound: {
          _id: userFound.id,
          email: userFound.email,
          alias: userFound.alias,
          service: userFound.service,
          urlPicture: userFound.urlPicture,
          isModerator: userFound.isModerator,
        },
      });
    } else {
      return res.status(500).json({ error: "access denied" });
    }
  },
  controlAuth: async (req, res) => {
    // Getting auth header
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);

    // Control token
    if (userId < 0) {
      return res.status(400).json({ error: "wrong token" });
    }
    let userFound = null;
    try {
      // Search user with id and get this attributes list
      userFound = await models.User.findOne({
        attributes: ["id"],
        where: { id: userId },
      });
    } catch (err) {
      return res.status(500).json({ error: "cannot find user" });
    }
    if (userFound) {
      return res.status(200).json({ success: "valid token" });
    } else {
      return res.status(500).json({ error: "user doesn't exist" });
    }
  },
  sendForgottenPasswordEmail: async (req, res) => {
    const email = req.body.email;
    // Control email with regex
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: "Email is not valid" });
    }
    // Search all users email
    let arrayOfEmailsFound = null;
    try {
      arrayOfEmailsFound = await models.User.findAll({
        attributes: ["email", "id"],
      });
    } catch (err) {
      return res.status(500).json({ error: "Unable to verify user" });
    }

    // Loop in array for decrypt and compare email
    let emailDecrypted = null;
    let idFound = null;
    try {
      arrayOfEmailsFound.forEach((eachEmailFound) => {
        const emailFoundDecryptedRaw = CryptoJS.AES.decrypt(
          eachEmailFound.email,
          process.env.CRYPTO_JS_KEY
        );
        let emailFoundDecrypted = emailFoundDecryptedRaw.toString(
          CryptoJS.enc.Utf8
        );
        if (emailFoundDecrypted === email) {
          idFound = eachEmailFound.id;
          emailDecrypted = emailFoundDecrypted;
        }
      });
    } catch (err) {
      return res.status(500).json({ error: "Cannot decrypt email" });
    }
    if (!emailDecrypted) {
      // If user email doesn't exist, send an email to invite to ShareMania
      try {
        // Prepare email
        let emailToSend = notRegistered.email({
          emailToSend: email,
        });
        // Send email
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        let response = await sgMail.send(emailToSend);
        console.log({ message: "email sent !", response: response });
        return res
          .status(202)
          .json({ message: "Email sent !", response: response });
      } catch (err) {
        return res.status(500).json({ error: "Cannot send email" });
      }
    } else {
      // If user email exist in database, send an email for initiate a new password :
      // First, create a token for forgotten password
      const token = jwtUtils.generateTokenForForgottenPassword(idFound);
      // Create a expire date of one hour (double check : same as token)
      const expireDate = Date.now() + 3600000;
      // Then, search if forgotten table is already existing for this user
      let forgottenTableAlreadyExist = null;
      let forgottenTableUpdated = null;
      try {
        forgottenTableAlreadyExist = await models.ForgottenPassword.findOne({
          where: {
            userId: idFound,
          },
        });
      } catch (err) {
        return res.status(500).json({
          error:
            "Unable to verify if user is already asked for forgotten password",
        });
      }

      if (!forgottenTableAlreadyExist) {
        // If forgotten table is not exist, create a new table
        try {
          forgottenTableUpdated = await models.ForgottenPassword.create({
            UserId: idFound,
            expireAt: expireDate,
            isValid: true,
          });
        } catch (err) {
          return res
            .status(500)
            .json({ error: "unable to create forgotten password" });
        }
      } else {
        // if forgotten table is already exist, update it
        try {
          forgottenTableUpdated = await forgottenTableAlreadyExist.update({
            expireAt: expireDate,
            isValid: true,
          });
        } catch (err) {
          return res
            .status(500)
            .json({ error: "unable to create forgotten password" });
        }
      }
      // Now, if the forgotten table is not null, send an email
      if (forgottenTableUpdated) {
        try {
          // Prepare email
          let emailToSend = resetYourPassword.email({
            host: req.headers.host,
            emailToSend: email,
            token: token,
          });
          // Send email
          sgMail.setApiKey(process.env.SENDGRID_API_KEY);
          let response = await sgMail.send(emailToSend);
          console.log({ message: "email sent !", response: response });
          return res
            .status(202)
            .json({ message: "Email sent !", response: response });
        } catch (err) {
          return res.status(500).json({ error: "Cannot send email" });
        }
      } else {
        return res
          .status(500)
          .json({ error: "unable to create forgotten password" });
      }
    }
  },
  changePassword: async (req, res) => {
    const newPassword = req.body.newPassword;
    const token = req.body.token;

    // First control token
    const userId = jwtUtils.getUserIdForForgottenPassword(token);
    if (userId < 0) {
      return res.status(400).json({ error: "wrong token" });
    }
    // Find forgotten table with user id
    try {
      forgottenTable = await models.ForgottenPassword.findOne({
        where: {
          userId: userId,
        },
      });
    } catch (err) {
      return res.status(500).json({
        error:
          "Unable to verify if user is already asked for forgotten password " +
          err,
      });
    }
    // If forgotten table doesn't exist
    if (!forgottenTable) {
      return res.status(500).json({
        error: "Forgotten password expired. Please restart process.",
      });
    }

    // Control if isValid is True in forgotten table in data base
    if (!forgottenTable.isValid) {
      return res.status(500).json({
        error: "Forgotten password expired. Please restart process.",
      });
    }

    // Control validity time of forgotten password request on server
    if (
      Date.now() >= forgottenTable.expireAt - 3600000 &&
      Date.now() <= forgottenTable.expireAt
    ) {
    } else {
      return res.status(500).json({
        error: "Forgotten password expired. Please restart process.",
      });
    }

    // Then change password
    let userFound = null;
    let userFoundUpdated = null;
    try {
      // Search for User
      userFound = await models.User.findOne({
        attributes: ["id", "email", "password", "isModerator"],
        where: { id: userId },
      });
    } catch (err) {
      return res.status(500).json({ error: "unable to verify user" });
    }

    // If new password and old password are differents, crypt it
    bcrypt.hash(newPassword, 5, async (error, bcryptedPassword) => {
      try {
        // Update profile with informations
        userFoundUpdated = await userFound.update({
          password: bcryptedPassword,
        });
      } catch (err) {
        return res.status(500).json({ error: "cannot update password" });
      }
      // If password is well updated
      if (userFoundUpdated) {
        // Decrypt email
        const userFoundEmailDecryptedRaw = CryptoJS.AES.decrypt(
          userFoundUpdated.email,
          process.env.CRYPTO_JS_KEY
        );
        const userFoundEmailDecrypted = userFoundEmailDecryptedRaw.toString(
          CryptoJS.enc.Utf8
        );
        // Send an email to confirm changes
        try {
          // Prepare email
          let emailToSend = confirmNewPassword.email({
            emailToSend: userFoundEmailDecrypted,
          });
          // Send email
          sgMail.setApiKey(process.env.SENDGRID_API_KEY);
          let response = await sgMail.send(emailToSend);
          console.log({ message: "email sent !", response: response });
        } catch (err) {
          return res.status(500).json({ error: "Cannot send email" });
        }

        // Stop validity for frogotten password process
        let forgottenTableUpdated = null;
        try {
          // Update profile with informations
          forgottenTableUpdated = await forgottenTable.update({
            isValid: false,
          });
        } catch (err) {
          return res
            .status(500)
            .json({ error: "Cannot stop validity of forgotten table" });
        }

        // And send response with a new connection token
        return res.status(201).json({
          message: "Password well updated and email for sent to the user.",
          token: jwtUtils.generateTokenForUser(userFoundUpdated),
        });
      } else {
        return res.status(500).json({ error: "cannot update user profile" });
      }
    });
  },
};
