// Packages
const express = require("express");
const { clientid } = require("../server");

// Global variables
const PayPalRouter = express.Router();

// Get the PayPal ClientID
PayPalRouter.get('/', (req, res, next) => {
    res.send( { clientid } );
});

module.exports = PayPalRouter;