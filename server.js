// Packages
const braintree = require('braintree');
const https = require("https");
const express = require("express");
const env = require("dotenv").config().parsed;

// Global variables
const app = express();
const PORT = 4433;
const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    // Add the Braintree Sandbox Keys to a .env file
    // Sandbox Keys are found in your Sandbox Control Panel
    merchantId: env.MERCHANTID,
    publicKey: env.PUBLICKEY,
    privateKey: env.PRIVATEKEY 
});
    // CLIENTID is found in the PayPal Developer Sandbox Account
const clientid = env.CLIENTID;

// Create HTTPS server
const key = env.SSL_PRIVATEKEY;
const cert = env.SSL_CERTIFICATE;
const httpsOptions = {key, cert};
const httpsServer = https.createServer(httpsOptions, app);

httpsServer.listen(PORT, () => {
    console.log("~HTTPS server at port", PORT, "is listening~");
});

// export variables before configuring routes otherwise they will be empty
module.exports = { gateway, clientid };

// Configure routes for Express Router
const ClientTokenRoute = require("./routes/ClientToken");
const PayPalRoute = require("./routes/PayPal");

// Configure Express
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/client.html");
});

app.use("/client_token", ClientTokenRoute);
app.use("/paypal", PayPalRoute);