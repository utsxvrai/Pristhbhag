const express = require('express');
const routes = require('./routes');
const pool = require('./config/db');
const cors = require('cors');
const {GrpcService} = require('./services');
require('dotenv').config();

// Create an Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Use the routes defined in the routes directory
app.use('/api', routes);

//connect to the database
pool.connect()
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection error', err));


  

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// Start the gRPC server
GrpcService.startGrpcServer();



