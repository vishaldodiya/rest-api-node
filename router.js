var DB = require('./database');

var router = {
    defineRoutes: function defineRoutes(app) {
        app.get("/posts", async function getRecords(req, res, next) {
    
            res.setHeader("Content-Type", "application/json");
            res.setHeader("Cache-Control", "max-age:0, no-cache");

            await DB.getAllPosts()
            .then(function(records) {
                if(!records || [] == records) {
                    // No Records Found: 404.
                    res.writeHead(404);
                    res.end(JSON.stringify({
                        "code": "NOT_FOUND",
                        "message": "Oops! No Posts found."
                    }));
                } else {
                    // Records Found: 200.
                    res.writeHead(200);
                    res.end(JSON.stringify(records));
                }
            })
            .catch(function(err) {
                res.writeHead(500);
                res.end(JSON.stringify({
                    "code": "Internal Server Error",
                    "message": err
                }));
                next(err);
            })
        });
    
        app.get("/posts/:id", async function getRecord(req, res, next) {

            res.setHeader("Content-Type", "application/json");
            res.setHeader("Cache-Control", "max-age:0, no-cache");

            await DB.getPost(req.params.id)
            .then(function (record) {
                if(!record) {
                    // No Record Found: 404.
                    res.writeHead(404);
                    res.end(JSON.stringify({
                        "code": "NOT_FOUND",
                        "message": "Oops! Requested post " + req.params.id + " not found."
                    }));
                } else {
                    // Record Found: 200.
                    res.writeHead(200);
                    res.end(JSON.stringify(record));
                }
            })
            .catch(function(err) {
                res.writeHead(500);
                res.end(JSON.stringify({
                    "code": "Internal Server Error",
                    "message": err
                }));
                next(err);
            })
        });
    
        app.post("/posts", async function setRecord(req, res, next) {
            res.setHeader("Content-Type", "application/json");
            res.setHeader("Cache-Control", "max-age:0, no-cache");

            await DB.insertPost(req.body)
            .then(function(record) {
                res.writeHead(201); // Success - Resource Created.
                res.end(JSON.stringify(record));
            })
            .catch(function(err) {
                res.writeHead(500);
                res.end(JSON.stringify({
                    "code": "Internal Server Error",
                    "message": err
                }));
                next(err);
            });
        });

        app.put("/posts/:id", async function updateRecord(req, res, next) {

            res.setHeader("Content-Type", "application/json");
            res.setHeader("Cache-Control", "max-age:0, no-cache");

            await DB.updatePost(req.params.id, req.body)
            .then(function(record) {
                res.writeHead(200);
                res.end(JSON.stringify(record));
            })
            .catch(function(err) {
                res.writeHead(500);
                res.end(JSON.stringify({
                    "code": "Internal Server Error",
                    "message": err
                }));
                next(err);
            });
        });

        app.delete("/posts/:id", async function deleteRecord(req, res, next) {
            res.setHeader("Content-Type", "application/json");
            res.setHeader("Cache-Control", "max-age: 0, no-cache");

            await DB.deletePost(req.params.id)
            .then(function(record) {
                res.writeHead(204); // Success - No Content
                res.end(JSON.stringify(record));
            })
            .catch(function(err) {
                res.writeHead(500);
                res.end(JSON.stringify({
                    "code": "Internal Server Error",
                    "message": err
                }));
                next(err);
            })
        });

        app.get("/categories", async function getRecords(req, res, next) {

            res.setHeader("Content-Type", "application/json");
            res.setHeader("Cache-Control", "max-age:0, no-cache");

            await DB.getAllCategories()
            .then(function(records){
                if(!records || [] == records) {
                    // No Records Found: 404.
                    res.writeHead(404);
                    res.end(JSON.stringify({
                        "code": "NOT_FOUND",
                        "message": "Oops! No Categories Found."
                    }))
                } else {
                    // Records Found: 200.
                    res.writeHead(200);
                    res.end(JSON.stringify(records));
                }
            })
            .catch(function(err) {
                res.writeHead(500);
                res.end(JSON.stringify({
                    "code": "Internal Server Error",
                    "message": err
                }))
                next(err);
            })
        });

        app.get("/categories/:id", async function getRecord(req, res, next) {
            res.setHeader("Content-Type", "application/json");
            res.setHeader("Cache-Control", "max-age:0, no-cache");

            await DB.getCategory(req.params.id)
            .then(function(record) {
                if(!record) {
                    // No Record Found: 404.
                    res.writeHead(404);
                    res.end(JSON.stringify({
                        "code": "NOT_FOUND",
                        "message": "Oops! No Category with id" + req.params.id + " Found."
                    }));
                } else {
                    // Records Found: 200.
                    res.writeHead(200);
                    res.end(JSON.stringify(record));
                }
            })
            .catch(function(err) {
                res.writeHead(500);
                res.end(JSON.stringify({
                    "code": "Internal Server Error",
                    "message": err
                }))
                next(err);
            })
        });

        app.put("/categories/:id", async function updateRecord(req, res, next) {
            res.setHeader("Content-Type", "application/json");
            res.setHeader("Cache-Control", "max-age:0. no-cache");

            await DB.updateCategory(req.params.id, req.body)
            .then(function(record) {
                res.writeHead(200);
                res.end(JSON.stringify(record));
            })
            .catch(function(err){
                res.writeHead(500);
                res.end(JSON.stringify({
                    "code": "Internal Server Error",
                    "message": err
                }));
                next(err);
            })
        });
    }
}

module.exports = router;
