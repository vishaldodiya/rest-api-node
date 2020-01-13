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
    
        app.get('/posts/:id/', async function getRecord(req, res, next) {
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
            let record = await DB.insertPost(req.body);
    
            res.setHeader("Content-Type", "application/json");
            res.setHeader("Cache-Control", "max-age:0, no-cache");
            res.writeHead(200);
            res.end(JSON.stringify(record));
        });
    }
}

module.exports = router;
