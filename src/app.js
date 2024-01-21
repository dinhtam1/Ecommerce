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
module.exports = app