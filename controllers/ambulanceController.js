const ambulance = require("../models/ambulance");

module.exports = {
  requestAmbulanceOrConciage: async (req, res) => {
    try { 
      const {
        pickup_location,
        destination_address,
        distance,
        request_type,
        patient_state,
        pickup_date,
      } = req.body;
      const user_id = req.userId;

      const data = {
        pickup_location,
        destination_address,
        distance,
        request_type,
        patient_state,
        pickup_date,
        user_id,
      };
      const response = await ambulance.addAmbulanceRequestDetails(data);

      console.log(response);

      return res.status(201).json({ message: "Request submitted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  /**Subscribing to Ambulance subscription plan */
newAmbulanceSunscription: async (req, res) => {  
								
  const {
    service_id,
    patient_name,
    sub_name,
    sub_duration,
    sub_amount,
    payment_status,
    sub_expiry 
     } = req.body;

  try {
	const subCheck = { service_id, patient_id: req.userId }
 const activeAmbulanceSub = await ambulance.findActiveAmbulanceSub(
        subCheck
      );
      if (activeAmbulanceSub) {
        return res.status(400).json({
          message: `You have an active Ambulance Subscription`,
        });
      }

    const newSubscription = {
    patient_id: req.userId,
    service_id,
    patient_name,
    sub_name,
    sub_duration,
    sub_amount,
    payment_status,
    sub_expiry       
    };

    const resultSubscription = await ambulance.createNewAmbulanceSubscription(newSubscription); 
    console.log(
      `${req.email}, successfully Subscribed to Ambulace plan on ${new Date()}`
    );
    return res.status(201).json(resultSubscription); 
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
},

// Home Visit Subscription
  /**Subscribing to Ambulance subscription plan */
newHomeVisitSunscription: async (req, res) => {  
								
  const {
    service_id,
    patient_name,
    sub_name,
    sub_duration,
    sub_amount,
    payment_status,
    sub_expiry 
     } = req.body;

  try {
	const subCheck = { service_id, patient_id: req.userId }
 const activeHomeVisitSub = await ambulance.findActiveAmbulanceSub(
        subCheck
      );
      if (activeHomeVisitSub ) {
        return res.status(400).json({
          message: `You have an active Home Visit Subscription`,
        });
      }

    const newSubscription = {
    patient_id: req.userId,
    service_id,
    patient_name,
    sub_name,
    sub_duration,
    sub_amount,
    payment_status,
    sub_expiry       
    };

    const resultSubscription = await ambulance.createNewAmbulanceSubscription(newSubscription); 
    console.log(
      `${req.email}, successfully Subscribed to Home visist plan on ${new Date()}`
    );
    return res.status(201).json(resultSubscription); 
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
},

  /** pulling Open/Closed Ambulance/Homevisit subscription plan */
patientSubscriptions: async (req, res) => {  
 const {sub_status} = req.body;
								
  try {
	const subCheck = { patient_id: req.userId }
 const activeHomeVisitSub = await ambulance.findSubscriptionByID(
        subCheck
      );
      if (!activeHomeVisitSub ) {
        return res.status(400).json({
          message: `You have No Subscriptions`,
        });
      }

    const dataSubscription = {
    patient_id: req.userId,
    sub_status     
    };

    const resultSubscription = await ambulance.findPatientsSubscripsions(dataSubscription); 
    console.log(
      `${req.email}, successfully Pulled subscription plan on ${new Date()}`
    );
    return res.status(200).json(resultSubscription); 
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
},

addNewAmbulance: async (req, res) => {
    const {
      plate,
      issuer,
      comments,
      driver,
      expiry,
      location,
    } = req.body;
    console.log(req.body);
    try {
      const data = {
        plate: plate,
        issuer: issuer,
        comments: comments,
        driver: driver,
        expiry: expiry,
        location: location,
      };
      const response = await ambulance.addAmbulannce(data);
      console.log(response);
      return res.status(200).json({ message: "Ambulance added successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },
  deleteAmbulance: async (req, res) => {
    try {
      const { ambulance_id } = req.body;
      const response = await ambulance.deleteAmbulance(ambulance_id);
      console.log(response);
      return res
        .status(200)
        .json({ message: "Ambulance deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },
  // user makes a request for an mbulance
  requestAmbulance: async (req, res) => {
    // todo validate inputs
    const {
      pickup_location,
      destination_address,
      distance,
      patient_state,
      pickup_date,
    } = req.body;
    const user_id = req.userId;
    const data = {
      pickup_location: pickup_location,
      destination_address: destination_address,
      distance: distance,
      patient_state: patient_state,
      pickup_date: pickup_date,
      user_id: user_id,
    };

    try {
      const response = await ambulance.addAmbulanceRequestDetails(data);
      console.log(response);
      // return past requests made by the user
      const getAppointments = await ambulance.getUserAmbulanceRequests(user_id);
      return res
        .status(201)
        .json({ getAppointments, message: "Request submitted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },
  editAmbulanceRequet: async (req, res) => {
    const { status, request_time, request_id } = req.body;
    const data = {
      request_id: request_id,
      request_time: request_time,
      status: status,
    };
    try {
      const response = await ambulance.editRequest(data);
      console.log(response);
      return res.status(200).json({ message: "Requested edited successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },
  getPendingAmbulanceRequest: async (req, res) => {
      const {request_status} = req.body;
  console.log(request_status);

    try {
      const response = await ambulance.getPendingRequest(request_status);
      //   console.log(response);
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  getPendinConciergeRequest: async (req, res) => {
  const {request_status} = req.body;
  console.log(request_status);
    try {
      const response = await ambulance.getPendingConciergeRequest(request_status);
      //   console.log(response);
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  getAmbulancesQuery: async (req, res) => {
    const { in_use } = req.query;
    try {
      const response = await ambulance.getAmbulance(in_use);
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },
  assignRequestToAmbulance: async (req, res) => {
    const { request_id, ambulance_id } = req.query;
    try {
      const response = await ambulance.assignAmbulance({
        request_id,
        ambulance_id,
      });
      console.log(response);
      return res
        .status(200)
        .json({ message: "Ambulance dispatched successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },
  ambulanceReview: async (req, res) => {
    // todo validate inputs
    const { rating_value, comments, request_id } = req.body;
    console.log(req.body);
    try {
      const response = await ambulance.addAmbulanceRating({
        rating_value,
        comments,
        request_id,
      });
      console.log(response);
      return res.status(200).json({ message: "Comment posted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },


};
