const Location = require("../models/locations");

module.exports = {
  locations: async (req, res) => {
    try {
      const result = await Location.findAllLocations();
      if (!result) {
        return res.status(404).json({ message: "Sorry no ocations setup." });
      }

      console.log(
        `location, successfully pulled on ${new Date()} by user ${req.userId}`
      ); 

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },
 nurseSpecialities: async (req, res) => {
    try {
      const result = await Location.findAllNursesSpecialities();
      if (!result) {
        return res.status(404).json({ message: "Sorry no speciality setup." });
      }

      console.log(
        `location, successfully pulled on ${new Date()} by user ${req.userId}`
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },
clinicianSpecialities: async (req, res) => {
    try {
      const result = await Location.findAllCliniciansSpecialities();
      if (!result) {
        return res.status(404).json({ message: "Sorry no speciality setup." });
      }

      console.log(
        `location, successfully pulled on ${new Date()} by user ${req.userId}`
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },


};
