'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');   // setup morgan which gives us http request logging
const sqlite3 = require('sqlite3');
const routes = require('./routes'); //Router method allowing everythin to /api w/o listing on every route
const courseRoutes = require("./routes/courses");
const userRoutes = require("./routes/users");
//app.use('/api', routes); //When request starts with /api, use routes inside routes.js file
const bcryptjs = require('bcryptjs');
const Sequelize = require ('sequelize');
// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';
const app = express(); // create the Express app
const cors = require('cors');
app.use(express.json()); // Setup request body JSON parsing.
app.use(morgan('dev')); // Setup morgan which gives us HTTP request logging.

app.use(cors());
app.use(routes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);

// setup morgan which gives us http request logging
app.use(morgan('dev'));

//Test authentication to Database
const sequelize = new Sequelize ({
  dialect: 'sqlite',
  storage: './fsjstd-restapi.db'
});

sequelize.authenticate()
  .then(() => {
    console.log('Database connection established');   
  }).catch(err => {
    console.log('Could not connect to the database' + err);
  });
  

  
// const currentUserId = currentUser[0].dataValues.id;

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: process.env.NODE_ENV === 'production' ? {} : err,
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});


