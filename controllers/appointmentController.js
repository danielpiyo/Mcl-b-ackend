// controllers/userController.js
const Appointment = require("../models/appointments");
const bcrypt = require("bcryptjs");

module.exports = {
  /**Get all appointments */
  getAllAppointments: async (req, res) => {
    try {
      const result = await Appointment.findAllAppointments();
      console.log(
        `${req.email}, successfully pulled all appointment on ${new Date()}`
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  /**Get all open appointments */
  getOpenAppointments: async (req, res) => {
    const appointmentData = {
      is_complete: 0,
    };
    try {
      const result = await Appointment.findAppointments(appointmentData); 
      console.log(
        `${
          req.email
        }, successfully pulled all open appointment on ${new Date()}`
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },
  /**Get all Closed appointments */
  getClosedAppointments: async (req, res) => {
    const appointmentData = {
      is_complete: 1,
    };
    try {
      const result = await Appointment.findAppointments(appointmentData);
      console.log(
        `${
          req.email
        }, successfully pulled all Closed appointment on ${new Date()}`
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },
  /** Open appointments pulled by User */
  getUserOpenAppointments: async (req, res) => {
    const appointmentData = {
      is_complete: 0,
      user_id: req.userId,
    };
    try {
      const result = await Appointment.findAppointmentsUser(appointmentData);
      console.log(
        `${
          req.email
        }, successfully pulled all User open appointment on ${new Date()}`
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },
  /** Closed appointments Pulled by User */
  getUserClosedAppointments: async (req, res) => {
    const appointmentData = {
      is_complete: 1,
      user_id: req.userId,
    };
    try {
      const result = await Appointment.findAppointmentsUser(appointmentData);
      console.log(
        `${
          req.email
        }, successfully pulled all User Closed appointment on ${new Date()}`
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },
  /** Open appointments Pulled by Doctors  */
  getDoctorOpenAppointments: async (req, res) => {
    const appointmentData = {
      is_complete: 0,
      doctor_id: req.userId,
    };
    try {
      const result = await Appointment.findAppointmentsDoctor(appointmentData);
      console.log(
        `${
          req.email
        }, successfully pulled all User open appointment on ${new Date()}`
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },
  /**Closed appointments Pulled by Doctor */
  getDoctorClosedAppointments: async (req, res) => {
    const appointmentData = {
      is_complete: 1,
      doctor_id: req.userId,
    };
    try {
      const result = await Appointment.findAppointmentsDoctor(appointmentData);
      console.log(
        `${
          req.email
        }, successfully pulled all User open appointment on ${new Date()}`
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

    makeTransactioForAppointment: async (req, res) => {
    const data = req.body;
    console.log(data);
    // wrong pin error and wrong input
    if (data.Body.stkCallback.ResultCode === 2001) {
      console.log(data.Body.stkCallback.ResultDesc);
      const errorMessage = data.Body.stkCallback.ResultDesc;
      return res
        .status(400)
        .json({ message: errorMessage + " You entered the wrong pin" });
    }
    //   request cancelled by user
    if (data.Body.stkCallback.ResultCode === 1032) {
      console.log(data.Body.stkCallback.ResultDesc);
      const errorMessage = data.Body.stkCallback.ResultDesc;
      return res
        .status(400)
        .json({ message: errorMessage + " You cancelled the request" });
    }

    //
    if (!data.Body.stkCallback.CallbackMetadata) {
      console.log(data.Body);
      // todo user has insufficeint balance
      const errorMessage = data.Body.stkCallback.ResultDesc;
      return res
        .status(400)
        .json({ message: errorMessage + " You Insurficient amount" });
    }

    //   successful payment
    console.log(data.Body.stkCallback.CallbackMetadata);
    try {
      const incomingData = data.Body.stkCallback.CallbackMetadata;
      if (incomingData) {
        const amountItem = incomingData.Item.find(item => item.Name === 'Amount');
        const receiptItem = incomingData.Item.find(item => item.Name === 'MpesaReceiptNumber');
        const dateItem = incomingData.Item.find(item => item.Name === 'TransactionDate');
        const phoneItem = incomingData.Item.find(item => item.Name === 'PhoneNumber');
    
        if (amountItem && receiptItem && dateItem && phoneItem) {
          const amount = amountItem.Value;
          const receipt = receiptItem.Value;
          const date = dateItem.Value;
          const phone_number = phoneItem.Value;
    
          const newData = {
            // transactionData: incomingData, 
            transaction_amount: amount,
            transaction_receipt: receipt,
            transaction_date: date,
            transaction_phone_number: phone_number
          };
    
          const result = await Appointment.createTransactionForAppointment(newData);
          console.log(`
            ${phone_number}, successfully made payment for amount ${amount} on ${new Date()}`
          );
    
          return res.status(201).json(result);
        } else {
          // Handle missing properties as needed
          return res.status(400).json({ message: "Required properties missing in incoming data" });
        }
      } else {
        // Handle missing CallbackMetadata
        return res.status(400).json({ message: "CallbackMetadata is missing in incoming data" });
      }
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  /**Booking/Creating an appointment */
  bookAppointment: async (req, res) => {
    const {
      service_id,
      doctor_id,
      site,
      physical_virtual,
      appointment_for,
      distance,
      amount,
      location,
      mobile,
      age,
      disease,
      chronic_yn,
      booking_date,
    } = req.body;
    try {
      const activeAppointment = await Appointment.findUserActiveAppointments(
        req.userId
      );
      if (activeAppointment) {
        return res.status(400).json({
          message: "You have an active appointment that is almost",
        });
      }

      const newAppointment = {
        user_id: req.userId,
        service_id,
        doctor_id,
        site,
        physical_virtual,
        appointment_for,
        distance,
        amount,
        latitude: location.lat,
        longitude: location.long,
        mobile,
        age,
        disease,
        chronic_yn,
        booking_date,
      };

      const result = await Appointment.createAppointment(newAppointment);
      console.log(
        `${
          req.email
        }, successfully Booked appointment with ${doctor_id} on ${new Date()}`
      );

      return res.status(201).json(result);
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

 /**Admin pullling all prescritions*/
  getAllAvailablePrescription: async (req, res) => {
      try {
      const result = await Appointment.pullAllPrescription();
      console.log(
        `${
          req.email
        }, successfully pulled all available prescription ${new Date()}`
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },




 /**Patients prescritions pulled by patient */
  getPatientsPrescription: async (req, res) => {
    const prescriptionData = {      
      patient_id: req.userId,
    };
    try {
      const result = await Appointment.findPrescriptionByPatientId(prescriptionData);
      console.log(
        `${
          req.email
        }, successfully pulled all His prescription ${new Date()}`
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  
  /**Prescribing an appointment */
prescribePatient: async (req, res) => {  
  const {
    appointment_id,
    patient_id,
    patient,
    doctor,
    doctor_notes,
    patient_description,
    service,
    service_id,
    suggestion
  } = req.body;

  try {
	const dataCheck = { appointment_id, doctor_id: req.userId }
 const activePrescription = await Appointment.findPrescriptionById(
        dataCheck
      );
      if (activePrescription) {
        return res.status(400).json({
          message: `That Patient is already prescribed by ${doctor}`,
        });
      }

    // Ensure that 'suggestion' is an array
    const suggestions = Array.isArray(suggestion) ? suggestion : [suggestion];

    const newPrescription = {
      appointment_id,
      patient_id,
      doctor_id: req.userId,
      patient,
      doctor,
      doctor_notes, 
      patient_description,
      service,
      service_id,
      suggestion: `${[suggestions]}`  // Use 'suggestions' instead of 'suggestion'
    };

    const resultPrescription = await Appointment.createPrescription(newPrescription); 
    console.log(
      `${req.email}, successfully Prescribed a patient on ${new Date()}`
    );
    return res.status(201).json(resultPrescription); 
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
},



  /**Updating Open Appointments */
  updateUpcomingAppointment: async (req, res) => {
    const {
      id,
      service_id,
      doctor_id,
      site,
      physical_virtual,
      appointment_for,
      distance,
      amount,
      location,
      mobile,
      age,
      disease,
      chronic_yn,
      booking_date,
    } = req.body;
    try {
      const userExistingAppointment =
        await Appointment.findUserActiveAppointmentToUpdate(id, req.userId);
      if (!userExistingAppointment) {
        return res.status(400).json({
          message: "Something weared is Up. Please consult the Administrator",
        });
      }
      const updateData = {
        id,
        user_id: req.userId,
        service_id,
        doctor_id,
        site,
        physical_virtual,
        appointment_for,
        distance,
        amount,
        latitude: location.lat,
        longitude: location.long,
        mobile,
        age,
        disease,
        chronic_yn,
        booking_date,
        updated_at: new Date(),
      };

      const result = await Appointment.updateDoctorAppontment(updateData);
      console.log(
        `${req.email}, successfully updated Appointment ${id} on ${new Date()}`
      );
      return res.status(201).json(result);
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },
  /**Patient/User Canceling open Appointment */
  userCancelAppointment: async (req, res) => {
    const { id } = req.body;

    try {
      const userExistingAppointment =
        await Appointment.findUserActiveAppointmentToUpdate(id, req.userId);
      if (!userExistingAppointment) {
        return res.status(400).json({
          message:
            "Something went wrong, please try again later/ Consult the Admin",
        });
      }
      const cancelData = {
        id,
        user_id: req.userId,
        updated_at: new Date(),
      };

      const result = await Appointment.userCancelAppointment(cancelData);
      console.log(
        `${req.email}, successfully Canceled Appointment on ${new Date()}`
      );
      return res.status(201).json(result);
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  /**Doctor cancel open Appointment */
  doctorCancelAppointment: async (req, res) => {
    const { id } = req.body;

    try {
      const userExistingAppointment = await Appointment.findAppointmentById(id);
      if (!userExistingAppointment) {
        return res.status(400).json({
          message:
            "Something went wrong, please try again later/ Consult the Admin",
        });
      }
      const cancelData = {
        id,
        user_id: req.userId,
        updated_at: new Date(),
      };

      const result = await Appointment.doctorCancelAppointment(cancelData);
      console.log(
        `${req.email}, successfully Canceled Appointment on ${new Date()}`
      );
      return res.status(201).json(result);
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  /**Reactivated Cancled Appointment */

  adminReactivateAppointment: async (req, res) => {
    const { id } = req.body;

    try {
      const userExistingAppointment = await Appointment.findAppointmentById(id);
      if (!userExistingAppointment) {
        return res.status(400).json({
          message:
            "Something went wrong, please try again later/ Consult the Admin",
        });
      }
      const reactivateData = {
        id,
        user_id: req.userId,
        updated_at: new Date(),
      };

      const result = await Appointment.adminReactivateAppointment(
        reactivateData
      );
      console.log(
        `${
          req.email
        }, successfully reactivated Initially Cancelled Appointment on ${new Date()}`
      );
      return res.status(201).json(result);
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  /**Close Appointment */

  doctorCloseAppointment: async (req, res) => {
    const { id } = req.body;

    try {
      const userExistingAppointment = await Appointment.findAppointmentById(id);
      if (!userExistingAppointment) {
        return res.status(400).json({
          message:
            "Something went wrong, please try again later/ Consult the Admin",
        });
      }
      const closeData = {
        id,
        user_id: req.userId,
        updated_at: new Date(),
      };

      const result = await Appointment.closeAppointment(closeData);
      console.log(
        `${req.email}, successfully Closed Appointment on ${new Date()}`
      );
      return res.status(201).json(result);
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  /**Update appointment progress (Pending/ */

  doctorupdateAppointmentProgress: async (req, res) => {
    const { id, appointment_status } = req.body;

    try {
      const existingAppointment = await Appointment.findAppointmentById(id);
      if (!existingAppointment) {
        return res.status(400).json({
          message:
            "Appointment seems not to exist",
        });
      }
      const upateData = {
        id,
        status: appointment_status,
        user_id: req.userId,
        updated_at: new Date(),
      };

      const result = await Appointment.updateAppointmentProgres(upateData);
      console.log(
        `${req.email}, successfully Updated Appointment progres on ${new Date()}`
      );
      return res.status(201).json(result);
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

/**Patient Rate the appointment */

  patientRateDoctorAppointment: async (req, res) => {
    const { id, rate } = req.body;

    try {
      const existingAppointment = await Appointment.findAppointmentById(id);
      if (!existingAppointment) {
        return res.status(400).json({
          message:
            "Appointment seems not to exist",
        });
      }
      const rateData = {
        id, 
        rate,
        updated_at: new Date(),
      };

      const result = await Appointment.rateDoctorAppointment(rateData);
      console.log(
        `${req.email}, successfully Rated Appointment on ${new Date()}`
      );
      return res.status(201).json(result);
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

// create a new help request ticket
raiseTicket: async (req, res) => {
    const {
      details
    } = req.body;
    try {
       const newTicket = {
        user_id: req.userId,
        email: req.email,
        details
      };

      const result = await Appointment.createNewTicket(newTicket);
      console.log(
        `${
          req.email
        }, successfully raised a ticket on ${new Date()}`
      );

      return res.status(201).json(result);
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

// All open/closed tickets
findOpenCloseTickets: async (req, res) => {
    const {
     status
      } = req.body;

    try {
       const dataStatus = {
      status
      };

      const result = await Appointment.findTickets(dataStatus);
      console.log(
        `${
          req.email
        }, successfully tickets on ${new Date()}`
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

// All available tickets
findAllTickets: async (req, res) => {
    try {
      const result = await Appointment.findAllTickets();
      console.log(
        ` successfully pulled All available tickets on ${new Date()}`
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },
 /**All transactions made */
  getAllTransactionsForAppointments: async (req, res) => {
       try {
      const result = await Appointment.getTransactionForAppointment();
      console.log(
        `${
          req.email
        }, successfully pulled all Transactions for appointment on ${new Date()}`
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

};
