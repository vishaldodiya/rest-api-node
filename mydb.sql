CREATE TABLE IF NOT EXISTS post(
    post_id INTEGER PRIMARY KEY ASC,
    title TEXT NOT NULL,
    content varchar(200)
);

CREATE TABLE IF NOT EXISTS category(
    category_id INTEGER PRIMARY KEY ASC,
    category_name varchar(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS relationship(
    post_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY(post_id, category_id),
    FOREIGN KEY(category_id) REFERENCES category(category_id),
    FOREIGN KEY(post_id) REFERENCES post(post_id)
);