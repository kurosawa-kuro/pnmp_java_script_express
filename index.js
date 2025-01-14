// Constants
const express = require('express');
const winston = require('winston');
const app = express();
const CONFIG = {
  port: 3000,
  logPath: './logs',
  cpuTestDuration: 2000,
  memoryTestSize: 1000000
};

// Logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'cloudwatch-test' },
  transports: [
    new winston.transports.File({ 
      filename: `${CONFIG.logPath}/error.log`, 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: `${CONFIG.logPath}/combined.log` 
    })
  ]
});

// Request tracking middleware
const requestTracker = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request processed', {
      method: req.method,
      path: req.path,
      duration,
      statusCode: res.statusCode
    });
  });
  next();
};

// Route handlers
const routeHandlers = {
  cpuTest: async (req, res) => {
    const startTime = Date.now();
    while (Date.now() - startTime < CONFIG.cpuTestDuration) {
      Math.random() * Math.random();
    }
    logger.info('CPU test completed');
    res.json({ status: 'CPU test completed', duration: CONFIG.cpuTestDuration });
  },

  memoryTest: (req, res) => {
    const arr = new Array(CONFIG.memoryTestSize).fill('test');
    logger.info('Memory test completed', { arraySize: arr.length });
    res.json({ 
      status: 'Memory test completed', 
      arraySize: CONFIG.memoryTestSize 
    });
  },

  errorTest: (req, res) => {
    const error = new Error('Test error');
    logger.error('Simulated error occurred', { error: error.message });
    res.status(500).json({ error: error.message });
  },

  healthCheck: (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  }
};

// Middleware registration
app.use(requestTracker);

// Route registration
app.get('/cpu-test', routeHandlers.cpuTest);
app.get('/memory-test', routeHandlers.memoryTest);
app.get('/error-test', routeHandlers.errorTest);
app.get('/health', routeHandlers.healthCheck);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { 
    error: err.message, 
    stack: err.stack 
  });
  res.status(500).json({ 
    error: 'Internal server error', 
    message: err.message 
  });
});

// Server initialization
app.listen(CONFIG.port, () => {
  logger.info(`Server started on port ${CONFIG.port}`);
});