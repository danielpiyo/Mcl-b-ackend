// controllers/userController.js
const User = require("../models/user");
const Email = require("../models/email");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

module.exports = {
  register: async (req, res) => {
    // fname, lname, email, org_id, password
    const { name, email, password, mobile, address, location_id, status } =
      req.body;

    try {
      const user = await User.findUserByEmail(email);
      if (!user) {
        return res.status(400).json({
          message:
            "Your Account is not verified. Please check your mail to verify",
        });
      }

      const hashedPassword = bcrypt.hashSync(
        password,
        bcrypt.genSaltSync(10),
        null
      );

      const newUser = {
        name,
        email,
        password: hashedPassword,
        mobile,
        address,
        location_id,
        status: 1,
        updated_at: new Date(),
      };

      const result = await User.updateUser(newUser);

      console.log(`${email}, successfully registerd on ${new Date()}`);

      const payload = {
        email: user.email,
        entity_id: user.id,
      };

      const token = jwt.sign(payload, config.jwtSecretKey, {
        expiresIn: "1d",
      });

      return res.status(200).json({
        user: {
          email: user.email,
          name: newUser.name,
          mobile: newUser.mobile,
          address: newUser.address,
          location_id: newUser.location,
          status: newUser.status,
        },
        token,
      });

      // return res.status(201).json(result, loginResult);
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  resetUserPassword: async (req, res) => {
     const { email, password, reg_code } =
      req.body;

    try {
      const user = await User.findUserByEmail(email);
      if (!user) {
        return res.status(400).json({
          message:
            "Your Account has Issues please contact system Admin",
        });
      }

      const hashedPassword = bcrypt.hashSync(
        password,
        bcrypt.genSaltSync(10),
        null
      );

      const newDetails = {        
        email,
        password: hashedPassword,
        reg_code,
        updated_at: new Date(),
      };

      const result = await User.resetUserPassword(newDetails);

      console.log(`${email}, successfully Reset Password on ${new Date()}`);    

      return res.status(201).json(result);

    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },


  onbording: async (req, res) => {
    const { email } = req.body;

    try {
      const user = await User.findUserByEmail(email);
      if (user) {
        return res.status(400).json({ message: "Email is already taken." });
      }

      const code = await User.randomCodeGeneration();
      console.log(code);
      const newUser = {
        email,
        reg_code: code,
      };

      const result = await User.createUser(newUser);

      console.log(`${email}, successfully onboarded on ${new Date()}`);

      const subject = "Welcome to Mclinic";
      const content = `Hello, <br>
        Thank you for showing intrest in Mclinic. You are one step away from a borderless healthcare services ... <br>
        Please verify your account to continue. <br>
	<h2 style="text-align: center;"><b>Verification Code: ${newUser.reg_code}</b></h2>`;
      /**Activate letter */
      const mailResult = await Email.sendEmail(newUser.email, subject, content);
      return res.status(201).json({ result, mailResult });
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error", details: error.message });
    }
  },


 resendActivationCode: async (req, res) => {
    const { email } = req.body;

    try {
      const user = await User.findUserByEmail(email);
      if (!user) {
        return res.status(400).json({ message: "Sorry your email was not captured. Please start the onboarding process again." });
      }

      const code = await User.randomCodeGeneration();
      console.log(code);
      const newUser = {
        email,
        reg_code: code,
        updated_at: new Date(),
      };

      const result = await User.updateUserRegCode(newUser);

      console.log(`${email}, Activation Code successfully resent on ${new Date()}`);

      const subject = "Welcome to Mclinic";
      const content = `Hello, <br>
        Thank you for showing intrest in Mclinic. You are one step away from a borderless healthcare services ... <br>
        Please verify your account to continue. <br>
	<h2 style="text-align: center;"><b>Verification Code: ${newUser.reg_code}</b></h2>`;
      /**Activate letter */
      const mailResult = await Email.sendEmail(newUser.email, subject, content);
      return res.status(201).json({ result, mailResult });
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error", details: error.message });
    }
  },


updateUserRegCode: async (req, res) => {
    const { email } = req.body;

    try {
      const user = await User.findUserByEmail(email);
      if (!user) {
        return res.status(400).json({ message: "Email does Not Exist on our Database." });
      }

      const code = await User.randomCodeGeneration();
      console.log(code);
      const newCode = {
        email,
        reg_code: code,
 	updated_at: new Date(),
      };

      const result = await User.updateUserRegCode(newCode);

      console.log(`${email}, successfully generated a new Code on ${new Date()}`);

      const subject = "Welcome to Mclinic";
      const content = `Hello, <br>
        Thank you for showing intrest in Mclinic. You are one step away from a borderless healthcare services ... <br>
        Please verify your account to continue. <br>
	<h2 style="text-align: center;"><b>Verification Code: ${newCode.reg_code}</b></h2>`;
      /**Activate letter */
      const mailResult = await Email.sendEmail(newCode.email, subject, content);
      return res.status(201).json({ result, mailResult });
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error", details: error.message });
    }
  },


  verify: async (req, res) => {
    const { email, reg_code } = req.body;

    const UserToVerify = {
      email,
      reg_code,
    };

    try {
      const user = await User.verifyUserCode(UserToVerify);
      if (!user) {
        return res
          .status(404)
          .json({ message: "Code not correct please click resend." });
      }

      const userData = {
        email: user.email,
        id: user.id,
        status: 1,
      };

      const result = await User.verifyUser(userData);

      console.log(`${email}, successfully Verified on ${new Date()}`);

      return res.status(201).json(result);
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  // ...other controllers...
};
