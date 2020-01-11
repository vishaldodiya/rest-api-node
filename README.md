# rest-api-node
Rest API in Node with SQLite.
It is a basic blog Rest-API which has database table to store blog post data and categories and their relationships.

## Start Server
```
npm run start
```

## API Reference.

### GET /posts
To get list of all posts.
```
$ curl http://localhost:8080/posts
```

### GET /posts/\<id>
To get one single post.
```
$ curl http://localhost:8080/posts/1
```

### POST /posts
To create a new post.
```
$ curl -X POST http://localhost:8080/posts -d '{"postTitle": "New Post Title", "postContent": "Hello World!!"}'
```

## Built With
* Node[https://nodejs.org/]
* npm[https://www.npmjs.com/]
* SQLite3[https://www.npmjs.com/package/sqlite3]
* express[https://www.npmjs.com/package/express]
* body-parser[https://www.npmjs.com/package/body-parser]

## Author
* Vishal Dodiya - vishaldodiya[https://github.com/vishaldodiya]

## License
This project is licensed under the MIT License
