// controllers/authController.js
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const User = require("../models/user");

module.exports = {
  signin: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      bcrypt.compare(password, user.password, (error, pwMatch) => {
        if (error || !pwMatch) {
          return res.status(401).json({ message: "Invalid email or password" });
        }

        const payload = {
          email: user.email,
          entity_id: user.id,
        };

        const token = jwt.sign(payload, config.jwtSecretKey, {
          expiresIn: "180d",
        });

        res.status(200).json({
          user: {
            email: user.email,
            name: user.name,
            mobile: user.mobile,
            address: user.address,
            location_id: user.location,
            status: user.status,
          },
          token,
        });
      });
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },
  // ...other controllers...
};
