"use strict";

var http = require("http");
var express = require("express");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.json()); // Parse application/json.

const HTTP_PORT = 8080;
var httpServer = http.createServer(app);

function startServer() {
    httpServer.listen(HTTP_PORT);
    console.log(`Listening on http://localhost:${HTTP_PORT}`);
}

module.exports = {app, startServer};
