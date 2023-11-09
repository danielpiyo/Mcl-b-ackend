const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

const email_user = process.env.EML_USR;
const email_pass = process.env.EML_PAS;
const email_host = process.env.EML_HOST;
const email_port = process.env.EML_PORT;

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: email_host,
  port: email_port,
  secure: false, // true for 465, false for other ports
  auth: {
    user: email_user,
    pass: email_pass,
  },
  pool: true, // Enable the connection pool
  maxConnections: 10, // Adjust as needed
});

module.exports = {
  // Your function to send the email
  sendEmail: async (emailAddress, subject, content) => {
    try {
      // Send email with HTML content containing the text with line breaks
      let info = await transporter.sendMail({
        from: email_user, // Replace with the sender's email address
        to: emailAddress, // Replace with the recipient's email address
        subject: subject,
        html: `<div style="border-color: #337ab7; border-radius:6px; border: 0px solid #337ab7;">
          <div style="border-bottom: 1px solid transparent; border-top-left-radius: 3px;
           border-top-right-radius: 3px; color: #fff; background-color: #f2ececee; border-color: #337ab7;">
       <h2 style="color:black"><img src="https://mclinic.co.ke/assets/images/logoIcon/logo.png" height="80px" width="200px"></h2>
       </div> </br>
       <p>${content.replace(/\n/g, "<br>")}</p>
       </br>      
       <p>Kind Regards,</p>
       <p>Mclinic</p>
       <small><i>This is a system generated mail. Please do not reply to it</i></small>
       <hr>
       </div>       
       `,
      });

      console.log("Email sent: " + info.response);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  },
};
