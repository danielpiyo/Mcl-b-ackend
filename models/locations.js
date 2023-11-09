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
  findAllLocations: async () => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }

        connection.query("SELECT * FROM locations", (error, result) => {
          connection.release();

          if (error) {
            return reject(error);
          }
          resolve(result);
        });
      });
    });
  },
 findAllNursesSpecialities: async () => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }

        connection.query("SELECT * FROM specialty WHERE type ='Nurse'", (error, result) => {
          connection.release();

          if (error) {
            return reject(error);
          }
          resolve(result);
        });
      });
    });
  },
findAllCliniciansSpecialities: async () => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }

        connection.query("SELECT * FROM specialty WHERE type ='Clinical Officer'", (error, result) => {
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
