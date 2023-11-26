const dotenv = require("dotenv");

module.exports = {
  jwtSecretKey: process.env.JWT_KEY,
  connection: {
    host: "127.0.0.1",
    user: "nixcraft",
    password: "festus004",
    database: "m_clinic"
  },
};
