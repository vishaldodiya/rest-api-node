var DB = require('./database');

var router = {
    defineRoutes: function defineRoutes(app) {
        app.get('/posts', async function getRecords(req, res, next) {
            let records = await DB.getAllPosts() || [];
    
            res.setHeader("Content-Type", "application/json");
            res.setHeader("Cache-Control", "max-age:0, no-chache");
            res.writeHead(200);
            res.end(JSON.stringify(records));
        });
    
        app.get('/posts/:id', async function getRecord(req, res, next) {
            let record = await DB.getPost(req.params.id);

            res.setHeader("Content-Type", "application/json");
            res.setHeader("Cache-Control", "max-age:0, no-chache");

            // No Record Found: 404.
            if ( ! record ) {
                res.writeHead(404);
                res.end(JSON.stringify({
                    "code": "NOT_FOUND",
                    "message": "Oops! Requested post " + req.params.id + " not found."
                }));
                return;
            }

            // Record Found: 200.
            res.writeHead(200);
            res.end(JSON.stringify(record));
        });
    
        app.post('/posts', async function setRecord(req, res, next) {
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

        app.put('/posts/:id', async function updateRecord(req, res, next) {

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

        app.delete('/posts/:id', async function deleteRecord(req, res, next) {
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
    }
}

module.exports = router;
