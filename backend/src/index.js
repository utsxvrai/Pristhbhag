const express = require('express');
const routes = require('./routes');
const pool = require('./config/db');
const cors = require('cors');
const {GrpcService} = require('./services');
require('dotenv').config();
const { connectRedis } = require('./utils/redisClient');
const { evaluateAnswer } = require('./services/evaluation-service');

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
  
  // Warm up the LLM model
  evaluateAnswer("warmup", "warmup")
    .then(() => console.log('LLM Warmup successful'))
    .catch(() => console.log('LLM Warmup failed (expected for non-technical input)'));
});

// Start the gRPC server
GrpcService.startGrpcServer();

// Connect to Redis (best-effort)
connectRedis().then(() => console.log('Connected to Redis')).catch((err) => console.warn('Redis not available at startup', err.message || err));



