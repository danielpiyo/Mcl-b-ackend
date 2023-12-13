// routes/api.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const locationController = require("../controllers/locationsController");
const doctorController = require("../controllers/doctorsController");
const serviceController = require("../controllers/servicesController");
const appointmentController = require("../controllers/appointmentController");
const doctorAuthController = require("../controllers/doctorAuthController");
const ambulanceController = require("../controllers/ambulanceController");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  userSignupRules,
  validate,
  signinRules,
  registerUserRules,
  verifyCodeRules,
} = require("../middlewares/validationMiddleware");

const {
  requestAmbulance,
  getPendingAmbulanceRequest,
  getPendinConciergeRequest,
  assignRequestToAmbulance,
  getAmbulancesQuery,
  ambulanceReview,
  addNewAmbulance,
  deleteAmbulance,
} = require("../controllers/ambulanceController");

router.post("/signin", signinRules(), validate, authController.signin);
router.post(
  "/register", userController.register
);
// router.post("/register", registerUserRules(), validate,  userController.register);

router.post("/signup", userSignupRules(), validate, userController.onbording);
router.post("/verify", verifyCodeRules(), validate, userController.verify);
router.post("/resendCodePatient", userController.resendActivationCode);
router.post("/resendCodeDoctor", doctorAuthController.updateDoctorRegCode);

router.post("/doctorSignin", doctorAuthController.signin);
router.post("/doctorSinup", doctorAuthController.onbording);
router.post("/doctorVerify", doctorAuthController.verify);
router.post("/doctorBasic", doctorAuthController.basicUpdate);
router.post("/doctorAcademic", doctorController.updateDoctorQualification);
router.post("/allDoctors", doctorController.getAllDoctor);
router.post("/doctorExperince", doctorController.updateDoctorExperience);
router.post(
  "/doctorAvailability",
  authMiddleware.verifyToken,
  doctorController.updateDoctorAvailability
);
router.post(
  "/checkDoctorAvailability",
  authMiddleware.verifyToken,
  doctorController.checkDoctorAvailability
);
router.post(
  "/doctorUpdateProgress",
  authMiddleware.verifyToken,
  appointmentController.doctorupdateAppointmentProgress
);
router.post(
  "/patientRateDoctor",
  authMiddleware.verifyToken,
  appointmentController.patientRateDoctorAppointment
);
router.post(
  "/homeVisitSubscription",
  authMiddleware.verifyToken,
  ambulanceController.newHomeVisitSunscription
);
router.post(
  "/ambulaceSubscription",
  authMiddleware.verifyToken,
  ambulanceController.newAmbulanceSunscription
);
router.post(
  "/patientSubscriptions",
  authMiddleware.verifyToken,
  ambulanceController.patientSubscriptions
);
const {
  handleAdminSignin,
  handleAdminSignup,
  handleForgotPassword,
  clickEmail,
  postForm,
  getAllAdmins,
  getDoctorByEmail,
  getPatientByEmail,
  closeSupportTicket,
  updateAppointmentTime,
  cancelAppointment,
  handleSuspendUser,
} = require("../controllers/adminController");
const { verifyAdminToken } = require("../middlewares/adminAuthMiddleware");

// Doctors Withdrawal
router.post(
  "/requestWithrawal",
  authMiddleware.verifyToken,
  doctorController.doctorRequestMoneyWithdrwal
);
router.post(
  "/myWithrawals",
  authMiddleware.verifyToken,
  doctorController.pullDoctorsWithdrawals
);

//
/**Location */
router.get("/locations", locationController.locations);
/**Specialities */
router.get("/nurseSpecialities", locationController.nurseSpecialities);
router.get("/clinicianSpecialities", locationController.clinicianSpecialities);

router.post(
  "/requestAmbulanceOrCnciage",
  authMiddleware.verifyToken,
  ambulanceController.requestAmbulanceOrConciage
);

/**Doctors */
router.post("/doctor", authMiddleware.verifyToken, doctorController.addDoctor);
router.post(
  "/doctor/all",
  authMiddleware.verifyToken,
  doctorController.getAllDoctor
);

/**get Nurses  */ 

router.post("/nurses", authMiddleware.verifyToken, doctorController.getNurses);
router.post("/nursesById",  authMiddleware.verifyToken, doctorController.doctorById);
/**Get Clinicians */
router.post("/clinicians", authMiddleware.verifyToken, doctorController.getClinician);

//clinicians being pulled by Admin
router.post("/admin/clinicians", verifyAdminToken, doctorController.getClinician);
//nurses being pulled by Admin
router.post("/admin/nurses", verifyAdminToken, doctorController.getNurses);

router.post("/cliniciansById", authMiddleware.verifyToken, doctorController.doctorById);
/**Services */
router.post("/createServices", verifyAdminToken, serviceController.createService);
router.put("/updateServices", verifyAdminToken, serviceController.updateAvailableService);
router.get("/services", serviceController.services);
router.post("/servicesById", authMiddleware.verifyToken, serviceController.serviceById);
/**Appointments */
router.post(
  "/newAppointment",
  authMiddleware.verifyToken,
  appointmentController.bookAppointment
);
router.post(
  "/updateAppointment",
  authMiddleware.verifyToken,
  appointmentController.updateUpcomingAppointment
);
router.post(
  "/getAllAppointments",
  authMiddleware.verifyToken,
  appointmentController.getAllAppointments
);
router.post(
  "/openAppointments",
  authMiddleware.verifyToken,
  appointmentController.getOpenAppointments
);
router.post(
  "/closedAppointments",
  authMiddleware.verifyToken,
  appointmentController.getClosedAppointments
);

router.post(
  "/allPrescriptions", verifyAdminToken,
  appointmentController.getAllAvailablePrescription
);

router.post(
  "/raiseTicket",
  authMiddleware.verifyToken,
  appointmentController.raiseTicket
);
router.post("/allAvailableTicket", verifyAdminToken, appointmentController.findAllTickets);

router.post(
  "/allOpen-closedTicket", verifyAdminToken,
  appointmentController.findOpenCloseTickets
);
router.post("/closeTicket", authMiddleware.verifyToken, closeSupportTicket )

// create new admin
router.post("/admin/create-admin", handleAdminSignup);
// login in admin
router.post("/admin/login", handleAdminSignin);
// admin forgort password
router.post("/admin/forgot-pass", handleForgotPassword);

// get change password form
router.get("/admin/reset", clickEmail);

// submit chnage password form
router.post("/admin/reset", postForm);
router.post(
  "/userCancelAppointment",
  authMiddleware.verifyToken,
  appointmentController.userCancelAppointment
);
router.post(
  "/doctorCancelAppointment",
  authMiddleware.verifyToken,
  appointmentController.doctorCancelAppointment
);
router.post(
  "/reactivateAppointments",
  authMiddleware.verifyToken,
  appointmentController.adminReactivateAppointment
);
// user Appointments
router.post(
  "/userOpenAppointments",
  authMiddleware.verifyToken,
  appointmentController.getUserOpenAppointments
);
router.post(
  "/userClosedAppointments",
  authMiddleware.verifyToken,
  appointmentController.getUserClosedAppointments
);
// Doctors Appointments
router.post(
  "/doctorOpenAppointments",
  authMiddleware.verifyToken,
  appointmentController.getDoctorOpenAppointments
);
router.post(
  "/doctorClosedAppointments",
  authMiddleware.verifyToken,
  appointmentController.getDoctorClosedAppointments
);
// Close appointment
router.post(
  "/closeAppointment",
  authMiddleware.verifyToken,
  appointmentController.doctorCloseAppointment
);
router.post(
  "/doctor/prescribe",
  authMiddleware.verifyToken,
  appointmentController.prescribePatient
);

router.post(
  "/doctor/balance",
  authMiddleware.verifyToken,
  doctorController.getDoctorsBalance
);

// patient pulling his prescription
router.post(
  "/patient/prescriptions",
  authMiddleware.verifyToken,
  appointmentController.getPatientsPrescription
);

// Patient Reset Password
router.post("/patient/resetCode", userController.updateUserRegCode);
router.post("/patient/resetPassword", userController.resetUserPassword);

// Doctor Reset Password
router.post("/doctor/resetCode", doctorAuthController.updateDoctorRegCode);
router.post("/doctor/query", verifyAdminToken, doctorController.getDoctorQuery);
router.post("/doctor/resetPassword", doctorAuthController.resetDoctorPassword);
// get all admins
router.post("/admin/get-all-admins", verifyAdminToken, getAllAdmins);

// get doctor by email
router.post("/admin/get-doctor-by-email", verifyAdminToken, getDoctorByEmail);
// approve doctor application
router.post(
  "/admin/doctor-approval",
  verifyAdminToken,
  doctorController.approveDoctorRequest
); 
// ...add other endpoints here...
// get patient by email
router.post("/admin/get-patient-by-email", verifyAdminToken, getPatientByEmail);

router.post("/add-ambulance", verifyAdminToken, addNewAmbulance);

// admin deletes an ambulance
router.post("/delete-ambulance", verifyAdminToken, deleteAmbulance);

// user makes request for an ambulance
router.post("/getAmbulance", requestAmbulance);
router.post("/editAmbulanceRequest", ambulanceController.editAmbulanceRequet);

// admin gets all pending ambulance requests
router.post("/pendingRequests", verifyAdminToken, getPendingAmbulanceRequest);
// admin gets all pending Medical concierge requests


// get free or inuse ambulnase  
router.post("/admin/getAllPAtients", verifyAdminToken, userController.getAllPatients);

router.post(
  "/admin/getAllTransactions",
  verifyAdminToken,
  appointmentController.getAllTransactionsForAppointments
);
router.post(
  "/admin/getAllWithdrawalRequest",
  verifyAdminToken,
  doctorController.pullAllWithdrawalsRequest
);

// Approve the withdrawal
router.post(
  "/admin/approveWithdrawalRequest",
  authMiddleware.verifyToken,
  verifyAdminToken,
  doctorController.approveDoctorsWithdrawalsRequest
);

router.post(
  "/pendingConciergeRequests",
  verifyAdminToken,
  getPendinConciergeRequest
);

// get free or inuse ambulnase
router.post("/getAmbulanceQuery", verifyAdminToken, getAmbulancesQuery);

// admin assign request to an ambulance
router.put("/assignAmbulance", verifyAdminToken, assignRequestToAmbulance);

router.post("/ambulance/rate", verifyAdminToken, ambulanceReview);

router.post(
  "/update-appointment-date",
  // authMiddleware.verifyToken,
  updateAppointmentTime
);
router.post(
  "/cancel-appointment",
  // authMiddleware.verifyToken,
  cancelAppointment
);

// suspend user
router.post("/suspendUser", verifyAdminToken, handleSuspendUser)

//Mpesa payment
router.post(
  "/payment/callback",
  appointmentController.makeTransactioForAppointment
);

// ...add other endpoints here...

module.exports = router;
