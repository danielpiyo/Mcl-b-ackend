// controllers/authController.js
const { validationResult } = require("express-validator");
const User = require("../models/user");
const Email = require("../models/email");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const Doctor = require("../models/doctors");

module.exports = {
  signin: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await Doctor.findDoctorByEmail(email);
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
            username: user.username,
            name: user.name,
            balance: user.balance,
            mobile: user.mobile,
            address: user.address,
            location_id: user.location,
            status: user.status,
            speciality: user.speciality,
            fees: user.fees,            
          },
          token,
        });
      });
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  basicUpdate: async (req, res) => {
    // fname, lname, email, org_id, password
    const {
      nationalId,
      dob,
      gender,
      speciality_id,
      dr_type,
      name,
      email,
      password,
      mobile,
      address,
      location_id,
    } = req.body;

    try {
      const doctor = await Doctor.findDoctorByEmail(email);
      if (!doctor) {
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
        nationalId, 
        dob,
        gender,
        speciality_id,
	dr_type,
        name,
        email,       
        mobile,
        address,
        location_id,
        password: hashedPassword,         
        updated_at: new Date(),
      };

      const result = await Doctor.updateDoctorBasic(newUser);

      console.log(`${email}, successfully updated Basic Data on ${new Date()}`);
      return res.status(201).json(result);
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  onbording: async (req, res) => {
    const { email } = req.body;

    try {
      const user = await Doctor.findDoctorByEmail(email);
      if (user) {
        return res.status(400).json({ message: "Email is already taken." });
      }

      const code = await User.randomCodeGeneration();
      console.log(code);
      const newUser = {
        email,
        reg_code: code,
      };

      const result = await Doctor.createDoctor(newUser);

      console.log(`${email}, successfully onboarded on ${new Date()}`);

      const subject = "Welcome to Mclinic";
      const content = `Hello, <br>
        Thank you for showing intrest in Mclinic. As a Medical Practisioner We value you ... <br>
        Please verify your account to continue. <br>
	      <h2 style="text-align: center;"><b>Verification Code: ${newUser.reg_code}</b></h2>`;
      /**Activate letter */
      const mailResult = await Email.sendEmail(newUser.email, subject, content);
      return res.status(201).json({ result, mailResult });
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({
        error: true,
        message: "Internal Server Error",
        details: error.message,
      });
    }
  },

  verify: async (req, res) => {
    const { email, reg_code } = req.body;

    const UserToVerify = {
      email,
      reg_code,
    };

    try {
      const user = await Doctor.verifyDoctorCode(UserToVerify);
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

      const result = await Doctor.verifyDoctor(userData);

      console.log(`${email}, successfully Verified on ${new Date()}`);

      return res.status(201).json(result);
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

updateDoctorRegCode: async (req, res) => {
    const { email } = req.body;

    try {
      const user = await Doctor.findDoctorByEmail(email);
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

      const result = await Doctor.updateUserRegCode(newCode);

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


 resetDoctorPassword: async (req, res) => {
     const { email, password, reg_code } =
      req.body;

    try {
      const user = await Doctor.findDoctorByEmail(email);
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

      const result = await Doctor.resetUserPassword(newDetails);

      console.log(`${email}, successfully Reset Password on ${new Date()}`);    

      return res.status(201).json(result);

    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  // ...other controllers...
};
