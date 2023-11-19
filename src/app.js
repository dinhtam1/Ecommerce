const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const app = express();

// Init middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
// Init DB

// Init routes
app.get('/', (req, res) => {
    res.status(500).json({
        message : "Hello world"
    })
})


module.exports = app