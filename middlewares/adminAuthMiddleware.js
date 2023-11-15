// verify admin token middleware
const jwt = require("jsonwebtoken");
const config = require("../config/config");

module.exports = {
  verifyAdminToken: (req, res, next) => {
    const token = req.body.token;

    if (!token) {
      return res
        .status(403)
        .json({ auth: false, message: "No token provided." });
    }

    jwt.verify(token, config.jwtSecretKey, (err, decoded) => {
      if (err) {
        return res
          .status(500)
          .json({ auth: false, message: "Your authentication token has Expired. Login again" });
      }

      req.userId = decoded.entity_id;
      req.email = decoded.email;
      next();
    });
  },
};
