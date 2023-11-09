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
  findDoctors: async () => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }

        connection.query(
          "SELECT * FROM doctors ORDER BY ID ASC",
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
  findNurses: async () => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }

        connection.query(
          "SELECT * FROM doctors WHERE dr_type = 'Nurse' AND status = 1 ORDER BY ID ASC",
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
  findClinician: async () => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }

        connection.query(
          "SELECT * FROM doctors WHERE dr_type = 'Clinical Officer' AND status = 1 ORDER BY ID ASC",
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
  findDoctorById: async (id) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }

        connection.query(
          "SELECT * FROM doctors WHERE id = ?", 
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

 findBalance: async (id) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        } 

        connection.query(
          "SELECT balance FROM doctors WHERE id = ?", 
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

  findDoctorByEmail: async (email) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }

        connection.query(
          "SELECT * FROM doctors WHERE email = ?",
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
  findDoctorByUsername: async (username) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }

        connection.query(
          "SELECT * FROM doctors WHERE username = ?",
          username,
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
  createDoctor: async (user) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }

        connection.query(
          "INSERT INTO doctors SET ?",
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

  verifyDoctorCode: async (userData) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }
        connection.query(
          "SELECT id,email FROM doctors WHERE email =? and reg_code =?",
          [userData.email, userData.reg_code],
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
verifyDoctor: async (user) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }
        const query = "UPDATE doctors SET Verified_status = ? WHERE id = ?";
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

 addDoctorQualification: async (user) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }
        connection.query(
          "INSERT INTO education SET ?",
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

  addDoctorLinsence: async (user) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }
        connection.query(
          "INSERT INTO operation_lincense SET ?",
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

 addDoctorExperience: async (user) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }
        connection.query(
          "INSERT INTO experiences SET ?",
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

 updateDoctorBasic: async (user) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }
        const query =
          "UPDATE doctors SET national_id =?, dob =?, sex =?, speciality =?, dr_type =?, name = ?, password =?, mobile = ?, address = ?, location_id =?,  updated_at = ? WHERE email = ?";
        const values = [
          user.nationalId,
          user.dob,
          user.gender,
          user.speciality_id,
	  user.dr_type,
          user.name,  
          user.password,  
          user.mobile,
          user.address,
          user.location_id,                 
          user.updated_at,
          user.email
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

  updateDoctorAvailability: async (user) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        return reject(err);
      }

      const query = `UPDATE doctors SET latitude =?, longitude =?, status =?,
                      updated_at=? WHERE id=?`; // Fixed the SQL query
      const values = [
        user.lat,
        user.lng,
        user.status,
        user.updated_at,
        user.userId,
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

updateUserRegCode: async (user) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }

        const query =
          "UPDATE doctors SET reg_code =?, updated_at=?  WHERE email = ?";
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
          "UPDATE doctors SET password = ?, updated_at=?  WHERE email = ? AND reg_code =?";
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

 findDoctorsAvailability: async (id) => { 
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }

        connection.query(
          "SELECT status FROM doctors where id =? ", id,
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

// capture dr request for withdrwal
requestWithdrwal: async (userRequest) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }
        connection.query(
          "INSERT INTO doctor_withdrwal_request SET ?",
          userRequest,
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

findOpenWithrawalRequest: async (id) => { 
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }

        connection.query(
          "SELECT * FROM doctor_withdrwal_request where doctor_id =?  and w_status = 'Pending Approval' ", id,
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

findAllWithdrawalRequest: async () => { 
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }

        connection.query(
          "SELECT * FROM doctor_withdrwal_request order by id DESC ",
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


findAllDoctorsWithrawalRequest: async (id) => {  
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }

        connection.query(
          "SELECT * FROM doctor_withdrwal_request where doctor_id =?  ORDER BY id DESC ", id,
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

// approve doctor withdrawal request
  updateDoctorWithdrawalStatus: (data) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }
        
        connection.query(
          "UPDATE doctor_withdrwal_request SET w_status = 'Approved', updated_at =?, updated_by =? WHERE id = ?", 
          [data.updated_at, data.userId, data.requestId],
          (err, result) => {
            connection.release();
            if (err) {
              return reject(err);
            }
            resolve(result);
          }
        );
      });
    });
  },


// approve or deny doctor application
  updateDoctorVerifiedStatus: (doctor_id, verified) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }
        
        connection.query(
          "UPDATE doctors SET approved_status = ? WHERE id = ?", 
          [verified, doctor_id],
          (err, result) => {
            connection.release();
            if (err) {
              return reject(err);
            }
            resolve(result);
          }
        );
      });
    });
  },
  findDoctorQuery: async (data) => {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }

        connection.query(
          "SELECT * FROM doctors WHERE approved_status = ? ORDER BY ID ASC",
          [data],
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

};
