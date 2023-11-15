const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const {
  addNewAdmin,
  loginAdmin,
  getAdminById,
  changeAdminPassword,
  getAdmins,
} = require("../models/admin");
const { sendEmail } = require("../models/email");
const { findDoctorByEmail } = require("../models/doctors");
const { findUserByEmail } = require("../models/user");

// create new admin
const handleAdminSignup = async (req, res) => {
  const { name, email, username, password } = req.body;
  const hashedPass = await bcrypt.hash(password, 10);

  const data = {
    name: name,
    email: email,
    username: username,
    password: hashedPass,
  };

  try {
    const response = await addNewAdmin(data);
    console.log(response);
    if (response.length !== 0) {
      return res
        .status(400)
        .json({ message: "An admin with the same email already exists" });
    }
    return res.status(201).json({ message: "Admin added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

// admin signin
const handleAdminSignin = async (req, res) => {
  const { email, password } = req.body;
  const data = {
    email: email,
    password: password,
  };
  const response = await loginAdmin(data);

  if (response.length === 0) {
    return res.status(401).json({ message: "Invalid login details" });
  }
  const validatePass = await bcrypt.compare(password, response[0].password);
  if (!validatePass) {
    return res.status(401).json({ message: "Invalid login details" });
  }

  //   generate token
  const tokenData = {
    email: response[0].email,
    user_id: response[0].id,
  };
  const userData = {
    name: response[0].name,
    email: response[0].email,
    user_id: response[0].id,
  };
  const token = jwt.sign(tokenData, config.jwtAdminSecret, { expiresIn: "1d" });
  return res.status(200).json({ message: "Login Successful", token, userData });
};

// forgot password
const handleForgotPassword = async (req, res) => {
  const { email } = req.body;
  const data = {
    email: email,
  };

  try {
    const response = await loginAdmin(data);
    if (response.length === 0) {
      return res
        .status(401)
        .json({ message: "We could not find your email address" });
    }
    const user = response[0];

    //   genearet toke
    const token = jwt.sign(
      { email: user.email, id: user.id },
      config.jwtSecretKey,
      { expiresIn: "30m" }
    );
    const link = `${process.env.SERVER_URL}/api/admin/reset?id=${user.id}&token=${token}`;
    const content = `<p>Hello, ${user.name} </p>
    <p>We have received a request to reset your password. If you did not request this change, please disregard this email.</p>
    <p>To reset your password, please click the following link:</p>
    <p><a href=${link}>Password Reset Link</a></p>
    <p>This link is valid for the next 30 minutes. If you have any questions or concerns, please don't hesitate to contact our support team.</p>
    <p>Best regards,<br>MCLINIC</p>`;
    const subject = "Password Reset Request";
    const emailAdress = user.email;

    const mailResult = await sendEmail(emailAdress, subject, content);
    return res.status(201).json({
      message: "Your reset link has been sent to your email. Please check",
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

const clickEmail = async (req, res) => {
  const { id, token } = req.query;
  const data = {
    id: id,
  };

  try {
    const response = await getAdminById(data);
    if (response.length === 0) {
      return res
        .status(401)
        .json({ message: "We could not find your email address" });
    }
    const user = response[0];
    jwt.verify(token, config.jwtSecretKey, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.sendStatus(401);
      }
    });
    res.render("../views/index", { email: user.email });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

const postForm = async (req, res) => {
  const { id, token } = req.query;
  const { password, confirmPassword } = req.body;
  if (!password) {
    return res.json("Password cannot be empty");
  } else if (password !== confirmPassword) {
    return res.json("Passwords do not match");
  }
  try {
    const value = {
      id: id,
    };
    const response = await getAdminById(value);
    if (response.length === 0) {
      return res
        .status(401)
        .json({ message: "We could not find your email address" });
    }
    const user = response[0];
    jwt.verify(token, config.jwtSecretKey, (err, decoded) => {
      if (err) {
        console.log(err);
        return res.sendStatus(401);
      }
    });
    const hashedPassword = await bcrypt.hash(password, 10);
    const data = {
      password: hashedPassword,
      id: id,
    };
    const changePassresponse = await changeAdminPassword(data);
    if (!changePassresponse) {
      return res.render("../views/error");
    }
    return res.render("../views/success");
  } catch (error) {
    console.error("Error occurred:", error);
    return res.render("../views/error");
  }
};

// get all admins
const getAllAdmins = async (req, res) => {
  try {
    const response = await getAdmins();
    // console.log(response);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "an error occurred" });
  }
};

// ! admin get a doctor by email
const getDoctorByEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const response = await findDoctorByEmail(email);
    if (!response) {
      return res.status(404).json({ message: "no doctor found" });
    }
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "an error occurred" });
  }
};
//  ! admin get a patient by email
const getPatientByEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const response = await findUserByEmail(email);
    if (!response) {
      return res.status(404).json({ message: "no patient found" });
    }
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "an error occurred" });
  }
};
module.exports = {
  handleAdminSignin,
  handleAdminSignup,
  handleForgotPassword,
  clickEmail,
  postForm,
  getAllAdmins,
  getDoctorByEmail,
  getPatientByEmail,
};