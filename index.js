"use strict";

var DB = require('./database');
var server = require('./server');
var router = require('./router');

main().catch(console.error);

async function main() {
    DB.loadDB(); // Load DB Data.
    server.startServer(); // Start Server.
    router.defineRoutes(server.app);
}