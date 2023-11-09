const config = require("../config/config");
const mysql = require("mysql2"); // Use mysql2 for connection pooling

// Create a connection pool
const pool = mysql.createPool({
  host: config.connection.host,
  user: config.connection.user,
  password: config.connection.password,
  database: config.connection.database,
  waitForConnections: true,
  connectionLimit: 10, // Adjust as needed
  queueLimit: 0, // Unlimited queue size
});

module.exports = {
  findSerrvices: async () => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }

        connection.query(
          "SELECT * FROM services WHERE deleted_yn ='N'",
          (error, result) => {
            connection.release();

            if (error) {
              return reject(error);
            }
            resolve(result);
          }
        );
      });
    });
  },
  findServiceById: async (id) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }

        connection.query(
          "SELECT * FROM services WHERE id =?",
          id,
          (error, result) => {
            connection.release();

            if (error) {
              return reject(error);
            }
            resolve(result[0]);
          }
        );
      });
    });
  },

 findServiceByName: async (name1) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }

        connection.query(
          "SELECT * FROM services WHERE name = ?",
          name1,
          (error, result) => {
            connection.release();

            if (error) {
              return reject(error);
            }
            resolve(result[0]);
          }
        );
      });
    });
  },


  createService: async (service) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }

        connection.query(
          "INSERT INTO services SET ?",
          service,
          (error, result) => {
            connection.release();

            if (error) {
              return reject(error);
            }
            resolve(result);
          }
        );
      });
    });
  },

  updateService: async (service) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }

        const query =
          "UPDATE services SET name = ?, detailed_name = ?, tag = ?, description = ?, cost =? , image_url= ?, updated_at = ?  WHERE id = ?";
        const values = [
          service.name,
          service.detailed_name,
          service.tag,
          service.description,
          service.cost,
          service.image_url,
          service.updated_at,
          service.id,
        ];

        connection.query(query, values, (error, result) => {
          connection.release();

          if (error) {
            return reject(error);
          }
          resolve(result);
        });
      });
    });
  },
};
