require('dotenv').config()
const compression = require('compression');
const express = require('express');
const app = express();
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');



// Sử dụng body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Init middleware
app.use(morgan('dev')) // log info HTTP request
app.use(helmet()) // Conceals server technologies to protect against certain web vulnerabilities
app.use(compression()) // Used to compress data, reducing the size of data transmitted over the network

// Init DB
require('./dbs/init.mongodb')

// Init routes
app.use('/' , require('./routes'))

// Handling errors
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    const status = error.status || 500;
    return res.status(status).json({
        status : 'error',
        code : status,
        message : error.message || 'Internal Server Error'
    })
})
module.exports = app