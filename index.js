const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const socketIo = require('socket.io');
const https = require('https');
const fs = require('fs');
const path = require('path');

const apiRoutes = require("./routes/api");

const app = express();

const corsOption = {
    origin: '*',
};
app.use(cors(corsOption));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const certPath = path.join(__dirname, 'cert'); // Adjust if needed

const options = {
  key: fs.readFileSync(path.join(certPath, 'api_key.pem')),
  cert: fs.readFileSync(path.join(certPath, 'fullchain.pem')),
 // rejectUnauthorized: false // Bypass SSL verification
};

app.use("/api", apiRoutes);

const port = process.env.PORT || 3000;
app.set('port', port);

const server = https.createServer(options, app);
// socket.io
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle incoming messages from patients or nurses
  socket.on('message', (message) => {
    console.log('Received message:', message);

    // Broadcast the message to all connected nurses
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});


server.on('error', (error) => {
    console.error('Error starting server:', error.message);
});

app.listen(port, () => {
    console.log(`Mclinic API listens on port: ${port}`);
});
