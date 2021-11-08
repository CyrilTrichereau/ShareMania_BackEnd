const jwt = require("jsonwebtoken");

// Exported functions
module.exports = {
  generateTokenForUser: (userData) => {
    return jwt.sign(
      {
        userId: userData.id
      },
      "(process.env.JWT_KEY)",
      {
        expiresIn: "48h",
      }
    );
  },
  parseAuthorization: (authorization) => {
    return authorization != null ? authorization.replace("Bearer ", "") : null;
  },
  getUserId: (authorization) => {
    let userId = -1;
    const token = module.exports.parseAuthorization(authorization);
    if (token != null) {
      try {
        const jwtToken = jwt.verify(token, "(process.env.JWT_KEY)");
        if (jwtToken != null) userId = jwtToken.userId;
      } catch (err) {}
    }
    return userId;
  },
  
  generateTokenForForgottenPassword: (userId) => {
    return jwt.sign(
      {
        userId: userId,
      },
      "(process.env.JWT_KEY_FORGOTTEN_PASSWORD)",
      {
        expiresIn: "1h",
      }
    );
  },
  getUserIdForForgottenPassword: (token) => {
    let userId = -1;
    if (token != null) {
      try {
        const jwtToken = jwt.verify(token, "(process.env.JWT_KEY_FORGOTTEN_PASSWORD)");
        if (jwtToken != null) userId = jwtToken.userId;
      } catch (err) {console.log({error: err}); }
    }
    return userId;
  },
};
