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
getAllpatients: async (email) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }

        connection.query(
          "SELECT * FROM users ORDER BY id DESC",
          email,
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
  findUserByEmail: async (email) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }

        connection.query(
          "SELECT * FROM users WHERE email = ?",
          email,
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
  createUser: async (user) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }

        connection.query(
          "INSERT INTO users SET ?",
          user,
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
  updateUser: async (user) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }

        const query =
          "UPDATE users SET name = ?, password = ?, mobile=?, status=?, address=?, location_id=?, updated_at=?  WHERE email = ?";
        const values = [
          user.name,
          user.password,
          user.mobile,
          user.status,
          user.address,
          user.location_id,
          user.updated_at,
          user.email,
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
 randomCodeGeneration: async () => {
    const codeLength = 6;
    const characters = "2TQ345YCGD6789";
    let code = "";

    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }

    return code;
  },
  verifyUserCode: async (userData) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }

        const query = "SELECT id,email FROM users WHERE email =? and reg_code =?";
        const values = [userData.email, userData.reg_code];
        connection.query(query, values, (error, result) => {
          connection.release();

          if (error) {
            return reject(error);
          }
          resolve(result[0]);
        });
      });
    });
  },
  verifyUser: async (user) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }

        const query = "update users set status =? where id = ?";
        const values = [user.status, user.id];
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
 updateUserRegCode: async (user) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }

        const query =
          "UPDATE users SET reg_code =?, updated_at=?  WHERE email = ?";
        const values = [
         user.reg_code,
         user.updated_at,
         user.email,	  
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

  resetUserPassword: async (user) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }

        const query =
          "UPDATE users SET password = ?, updated_at=?  WHERE email = ? AND reg_code =?";
        const values = [
          user.password,
          user.updated_at,
          user.email,
	  user.reg_code,
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

  findUserById: async (id) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }

        connection.query(
          "SELECT * FROM users WHERE id =?",
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
};
