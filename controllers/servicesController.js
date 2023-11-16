const Service = require("../models/service");

module.exports = {
  services: async (req, res) => {
    try {
      const result = await Service.findSerrvices();
      if (!result) {
        return res.status(404).json({ message: "Sorry no Services setup." });
      }

      console.log(`Service, successfully pulled on ${new Date()} `);

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  serviceById: async (req, res) => {
    const id = req.params.id;
    try {
      const result = await Service.findServiceById(id);
      if (!result) {
        return res
          .status(404)
          .json({ message: "Sorry thet service does not exist." });
      }

      console.log(
        `Service with id ${id}, successfully pulled on ${new Date()} ` 
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

 createService: async (req, res) => {
    const {
      name,
      detailed_name,
      tag,
      cost,
      description,
      image_url
         } = req.body;

    try {
      const serv = await Service.findServiceByName(name);
      if (serv) {
        return res.status(400).json({
          message:
            "Sorry there is an existing servce with that name.Use a different name",
        });
      }
      
      const newService = {
       name,
      detailed_name,
      tag,
      cost,
      description,
      image_url

      };

      const result = await Service.createService(newService);

      console.log(`successfully Created an anew servive on ${new Date()}`);
      return res.status(201).json(result);
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

 updateAvailableService: async (req, res) => {
    const {
      id,
      name,
      detailed_name,
      tag,
      cost,
      description,
      image_url
         } = req.body;

    try {
      const serv = await Service.findServiceById(id);
      if (!serv) {
        return res.status(400).json({
          message:
            "Sorry there seems to be a problem. Try again latter",
        });
      }
      
      const updatedService = {
      name,
      detailed_name,
      tag,
      cost,
      description,
      image_url,
      id,
      updated_at: new Date(),
      };

      const result = await Service.updateService(updatedService);

      console.log(`successfully Updated service ${updatedService.name} at ${new Date()}`);
      return res.status(201).json(result);
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

};
