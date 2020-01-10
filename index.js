"use strict";

var util = require("util");
var path = require("path");
var fs = require("fs");
var http = require("http");
var sqlite3 = require("sqlite3");

// Setup DB Paths.
const DB_PATH = path.join(__dirname, "my.db");
const DB_SQL_PATH = path.join(__dirname, "mydb.sql");
const HTTP_PORT = 8080;

var SQL3;

var httpServer = http.createServer(handleRequest);
main().catch(console.error);

async function main() {
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

async function insertPost(postTitle, postContent) {
    var result = await SQL3.run(
        `INSERT INTO post (title, content) VALUES (?, ?)`,
        postTitle,
        postContent
    );

    if (null != result) {
        return result.post_id;
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

async function handleRequest(request, response) {
    if (/\/get-posts\b/.test(request.url)) {
        let records = await getAllPosts() || [];

        response.writeHead(200, {
            "Content-Type": "application/json",
            "Cache-Control": "max-age: 0, no-cache",
        });

        response.end(JSON.stringify(records));
    } else if (/\/post\/(?<id>\d*\b)/.test(request.url)) {
        console.log(request);
        let record = await getPost(request.params.id) || [];

        response.writeHead(200, {
            "Content-Type": "application/json",
            "Cache-Control": "max-age: 0, no-cache",
        });
    } else {
        response.writeHead(404);
        response.end('Records not Found!');
    }
}