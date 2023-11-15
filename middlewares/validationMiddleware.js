const { body, validationResult } = require("express-validator");

// rules for user-signup email only
const userSignupRules = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("Invlaid email address")
      .normalizeEmail(),
  ];
};

// validtaion rules for signin
const signinRules = () => {
  return [
    body("email").notEmpty().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ];
};

// rules for regitser user
const registerUserRules = () => {
  return [
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .matches(/^[a-zA-Z\s\-']+$/)
      .withMessage("Invalid name format"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
    body("mobile")
      .notEmpty()
      .withMessage("Mobile number is required"),
    body("status")
      .notEmpty()
      .withMessage("Status is required")
      .isInt()
      .withMessage("Status must be an integer"),
    body("address").notEmpty().withMessage("Address is required"),
    body("location_id")
      .notEmpty()
      .withMessage("Location ID is required")
      .isInt()
      .withMessage("Location ID must be an integer"),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email address"),
  ];
};

// rules to verify code
const verifyCodeRules = () => {
  return [
    body("email").notEmpty().withMessage("Email is required"),
    body("reg_code").notEmpty().withMessage("Registration code is required"),
  ];
};

// validation rules for requesting an ambulance
const requestAmbulanceRules = () => {
  return [
    body("patient_name")
      .isString()
      .withMessage("Invalid Input")
      .notEmpty()
      .withMessage("Name cannot be empty"),
    body("emergency_severity").isString(),
    body("emergency_nature").isString(),
    body("pickup_location")
      .isString()
      .notEmpty()
      .withMessage("Name cannot be empty"),
  ];
};

// rules to validate ambulance rating
const ratingRules = () => {
  return [
    body("rating_value")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating should be between 1 and 5"),
    body("comments")
      .isString()
      .isLength({ min: 5 })
      .withMessage("Commments should be atleast 5 characters"),
  ];
};

// rules to validate admin signup
const adminSignupRules = () => {
  return [
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .matches(/^[a-zA-Z\s\-']+$/)
      .withMessage("Invalid name format"),
    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .matches(/^[a-zA-Z\s\-']+$/)
      .withMessage("Invalid name format"),

    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email address"),
  ];
};

// function to perform validtaion
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  //   get errors from express validator
  const extractedErrors = errors.array().map((err) => {
    return { param: err.param, msg: err.msg };
  });

  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  validate,
  requestAmbulanceRules,
  ratingRules,
  signinRules,
  userSignupRules,
  registerUserRules,
  verifyCodeRules,
  adminSignupRules,
};
