"use strict";

var util = require("util");
var path = require("path");
var fs = require("fs");
var http = require("http");
var sqlite3 = require("sqlite3");
var express = require("express");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.json()); // parse application/json.

// Setup DB Paths.
const DB_PATH = path.join(__dirname, "my.db");
const DB_SQL_PATH = path.join(__dirname, "mydb.sql");
const HTTP_PORT = 8080;

var SQL3;

var httpServer = http.createServer(app);
main().catch(console.error);

async function main() {
    defineRoutes(app);
    var myDB = new sqlite3.Database(DB_PATH);

    SQL3 = {
        run(...args) {
            return new Promise(function(resolve, reject) {
                myDB.run(...args, function onResult(err) {
                    if (err) reject(err);
                    else resolve(this);
                })
            });
        },
        get: util.promisify(myDB.get.bind(myDB)),
        all: util.promisify(myDB.all.bind(myDB)),
        exec: util.promisify(myDB.exec.bind(myDB))
    };

    var initSQL = fs.readFileSync(DB_SQL_PATH, "utf-8");
    await SQL3.exec(initSQL);

    httpServer.listen(HTTP_PORT);
    console.log(`Listening on http://localhost:${HTTP_PORT}`);
}

async function insertPost(data) {
    var result = await SQL3.run(
        `INSERT INTO post (title, content) VALUES (?, ?)`,
        data.postTitle,
        data.postContent
    );

    if (null != result) {
        return result.lastID;
    }
}

async function getAllPosts() {
    var result = await SQL3.all(
        `SELECT * FROM post`
    );

    return result;
}

async function getPost(postId) {
    var result = await SQL3.get(
        `SELECT * FROM post WHERE post_id=?`,
        postId
    );

    return result;
}

async function updatePost(postId, data) {

    var newData = Object.entries(data).map(([key, value]) => `${key}="${value}"`).join(',');

    var result = await SQL3.run(
        `UPDATE post SET ${newData} WHERE post_id=?`,
        postId
    );

    return result;
}

function defineRoutes(app) {
    app.get('/posts', async function getRecords(req, res, next) {
        let records = await getAllPosts() || [];

        res.setHeader("Content-Type", "application/json");
        res.setHeader("Cache-Control", "max-age:0, no-chache");
        res.writeHead(200);
        res.end(JSON.stringify(records));
    });

    app.get('/posts/:id/', async function getRecord(req, res, next) {
        let record = await getPost(req.params.id) || [];

        res.setHeader("Content-Type", "application/json");
        res.setHeader("Cache-Control", "max-age:0, no-chache");
        res.writeHead(200);
        res.end(JSON.stringify(record));
    });

    app.post('/posts', async function setRecord(req, res, next) {
        let record = await insertPost(req.body);

        res.setHeader("Content-Type", "application/json");
        res.setHeader('Cache-Control', "max-age:0, no-cache");
        res.writeHead(200);
        res.end(JSON.stringify(record));
    });
}