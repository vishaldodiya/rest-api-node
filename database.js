'use strict';

var sqlite3 = require('sqlite3');
var util = require("util");
var fs = require('fs');
var path = require('path');

const DB_PATH = path.join(__dirname, 'my.db');
const DB_SQL_PATH = path.join(__dirname, 'mydb.sql');

var myDB = new sqlite3.Database(DB_PATH);

var DB = {
    SQL3: {
        run(...args) {
            return new Promise(function(resolve, reject) {
                myDB.run(...args, function onResult(err) {
                    if (err) reject(err);
                    else resolve(this); 
                })
            })
        },
        get: util.promisify(myDB.get.bind(myDB)),
        all: util.promisify(myDB.all.bind(myDB)),
        exec: util.promisify(myDB.exec.bind(myDB))
    },
    loadDB: async function loadDb() {
        var initSQL = fs.readFileSync(DB_SQL_PATH, 'utf-8');
        await this.SQL3.exec(initSQL);
    },
    insertPost: async function insertPost(data) {
        var result = await this.SQL3.run(
            `INSERT INTO post (title, content) VALUES (?, ?)`,
            data.postTitle,
            data.postContent
        );
    
        if (null != result) {
            return result.lastID;
        }
    },
    getAllPosts: async function getAllPosts() {
        var result = await this.SQL3.all(
            `SELECT * FROM post`
        );
    
        return result;
    },
    getPost: async function getPost(postId) {
        var result = await this.SQL3.get(
            `SELECT * FROM post WHERE post_id=?`,
            postId
        );
    
        return result;
    },
    updatePost: async function updatePost(postId, data) {

        var newData = Object.entries(data).map(([key, value]) => `${key}="${value}"`).join(',');
    
        var result = await this.SQL3.run(
            `UPDATE post SET ${newData} WHERE post_id=?`,
            postId
        );
    
        return result;
    },
    deletePost: async function deletePost(postId) {
        var result = await this.SQL3.run(
            `DELETE FROM post WHERE post_id=?`,
            postId
        );

        return result;
    },
    getAllCategories: async function getAllCategories() {
        var result = await this.SQL3.all(
            `SELECT * FROM category`
        );

        return result;
    },
    getCategory: async function getCategory(categoryId) {
        var result = await this.SQL3.get(
            `SELECT * FROM category WHERE category_id=?`,
            categoryId
        );

        return result;
    },
    updateCategory: async function updateCategory(categoryId, data) {
        var newData = Object.entries(data).map(([key, value]) => `${key}="${value}"`).join(',');

        var result = await this.SQL3.run(
            `UPDATE category SET ${newData} WHERE category_id=?`,
            categoryId
        );

        return result;
    }
}

module.exports = DB;