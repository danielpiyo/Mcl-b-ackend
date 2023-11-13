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
  requestAmbulance,
  getPendingAmbulanceRequest,
   getPendinConciergeRequest,
  assignRequestToAmbulance,
  getAmbulancesQuery,
  ambulanceReview,
  addNewAmbulance,
  deleteAmbulance,
} = require("../controllers/ambulanceController");

router.post("/signin", authController.signin);
router.post("/register", userController.register); 
router.post("/signup", userController.onbording); 
router.post("/verify", userController.verify);
router.post("/resendCodePatient", userController.resendActivationCode); 
router.post("/resendCodeDoctor", doctorAuthController.updateDoctorRegCode); 

router.post("/doctorSignin", doctorAuthController.signin);
router.post("/doctorSinup", doctorAuthController.onbording); 
router.post("/doctorVerify", doctorAuthController.verify);
router.post("/doctorBasic", doctorAuthController.basicUpdate);
router.post("/doctorAcademic", doctorController.updateDoctorQualification); 
router.post("/allDoctors", doctorController.getAllDoctor); 
router.post("/doctorExperince", doctorController.updateDoctorExperience);
router.post("/doctorAvailability", authMiddleware.verifyToken, doctorController.updateDoctorAvailability);
router.post("/checkDoctorAvailability", authMiddleware.verifyToken, doctorController.checkDoctorAvailability);
router.post("/doctorUpdateProgress", authMiddleware.verifyToken, appointmentController.doctorupdateAppointmentProgress);
router.post("/patientRateDoctor", authMiddleware.verifyToken, appointmentController.patientRateDoctorAppointment);
router.post("/homeVisitSubscription", authMiddleware.verifyToken, ambulanceController.newHomeVisitSunscription);
router.post("/ambulaceSubscription", authMiddleware.verifyToken, ambulanceController.newAmbulanceSunscription); 
router.post("/patientSubscriptions", authMiddleware.verifyToken, ambulanceController.patientSubscriptions); 
const { handleAdminSignin, handleAdminSignup, handleForgotPassword, clickEmail, postForm, getAllAdmins, getDoctorByEmail, getPatientByEmail } = require("../controllers/adminController");

// Doctors Withdrawal
router.post("/requestWithrawal", authMiddleware.verifyToken, doctorController.doctorRequestMoneyWithdrwal);  
router.post("/myWithrawals", authMiddleware.verifyToken, doctorController.pullDoctorsWithdrawals); 


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

router.get("/nurses", doctorController.getNurses);
router.get("/nurses/:id", doctorController.doctorById);
/**Gete Clinicians */
router.get("/clinicians", doctorController.getClinician);
router.get("/clinicians/:id", doctorController.doctorById);
/**Services */
router.post("/createServices", serviceController.createService);
router.put("/updateServices", serviceController.updateAvailableService);
router.get("/services", serviceController.services);
router.get("/services/:id", serviceController.serviceById);
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
  "/allPrescriptions",
  appointmentController.getAllAvailablePrescription
);

router.post(
  "/raiseTicket",
 authMiddleware.verifyToken,
  appointmentController.raiseTicket
); 
router.post(
  "/allAvailableTicket",
  appointmentController.findAllTickets
);

router.post(
  "/allOpen-closedTicket",
  appointmentController.findOpenCloseTickets
); 

// create new admin
router.post("/admin/create-admin", handleAdminSignup)
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
router.post(
  "/patient/resetCode", userController.updateUserRegCode
);
router.post(
  "/patient/resetPassword", userController.resetUserPassword
);

// Doctor Reset Password
router.post(
  "/doctor/resetCode", doctorAuthController.updateDoctorRegCode
);
router.post("/doctor/query",doctorController.getDoctorQuery)
router.post(
  "/doctor/resetPassword", doctorAuthController.resetDoctorPassword
);
// get all admins
router.get("/admin/get-all-admins", getAllAdmins);


// get doctor by email
router.post("/admin/get-doctor-by-email", getDoctorByEmail);
// approve doctor application
router.post("/admin/doctor-approval",doctorController.approveDoctorRequest) 
// ...add other endpoints here... 
// get patient by email
router.post("/admin/get-patient-by-email", getPatientByEmail);


router.post("/add-ambulance", addNewAmbulance);

// admin deletes an ambulance
router.post("/delete-ambulance", deleteAmbulance);

// user makes request for an ambulance
router.post(
  "/getAmbulance",
  requestAmbulance
);
router.post("/editAmbulanceRequest", ambulanceController.editAmbulanceRequet)


// admin gets all pending ambulance requests
router.post("/pendingRequests", getPendingAmbulanceRequest);
// admin gets all pending Medical concierge requests

router.post("/admin/getAllTransactions", appointmentController.getAllTransactionsForAppointments);
router.post("/admin/getAllWithdrawalRequest", doctorController.pullAllWithdrawalsRequest);

// Approve the withdrawal
router.post("/admin/approveWithdrawalRequest", 
  authMiddleware.verifyToken, doctorController.approveDoctorsWithdrawalsRequest);


router.post("/pendingConciergeRequests", getPendinConciergeRequest);


// get free or inuse ambulnase
router.get("/getAmbulanceQuery", getAmbulancesQuery);

// admin assign request to an ambulance
router.put("/assignAmbulance", assignRequestToAmbulance);

router.post("/ambulance/rate", ambulanceReview);

//Mpesa payment
router.post(
  "/payment/callback",
  appointmentController.makeTransactioForAppointment
);


// ...add other endpoints here...

module.exports = router;
