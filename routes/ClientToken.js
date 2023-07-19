// Packages
const express = require("express");
const { gateway } = require("../server");

// Global variables
const ClientTokenRouter = express.Router();

// Get the client token
ClientTokenRouter.get('/', (req, res, next) => {
    gateway.clientToken.generate({}, (err, response) => {
        res.send(response);
    });
});

module.exports = ClientTokenRouter;