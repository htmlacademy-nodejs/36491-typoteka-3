CREATE TABLE categories
(
  id   bigserial PRIMARY KEY,
  name varchar(255) NOT NULL
);
CREATE TABLE users
(
  id            bigserial PRIMARY KEY,
  email         varchar(255) UNIQUE NOT NULL,
  password_hash varchar(255)        NOT NULL,
  first_name    varchar(255)        NOT NULL,
  last_name     varchar(255)        NOT NULL,
  avatar        varchar(50)         NOT NULL,
  role          varchar(255)        NOT NULL
);
CREATE TABLE articles
(
  id               bigserial PRIMARY KEY,
  title            varchar(255)  NOT NULL,
  announcement     varchar(250)  NOT NULL,
  text             varchar(1000) NOT NULL,
  publication_date timestamp DEFAULT current_timestamp,
  photo            varchar(255)  NOT NULL,
  user_id integer NOT NULL
);
CREATE TABLE comments
(
  id               bigserial PRIMARY KEY,
  publication_date timestamp DEFAULT current_timestamp,
  text             text NOT NULL,
  article_id  bigserial NOT NULL,
  user_id    bigserial NOT NULL
);

CREATE TABLE article_categories
(
  article_id  bigserial NOT NULL,
  category_id bigserial NOT NULL,
  PRIMARY KEY (article_id, category_id),
  FOREIGN KEY (article_id) REFERENCES articles (id),
  FOREIGN KEY (category_id) REFERENCES categories (id)
);
CREATE TABLE article_comments
(
  article_id bigserial NOT NULL,
  comment_id bigserial NOT NULL,
  PRIMARY KEY (article_id, comment_id),
  FOREIGN KEY (article_id) REFERENCES articles (id),
  FOREIGN KEY (comment_id) REFERENCES comments (id)
);
CREATE TABLE user_articles
(
  user_id    bigserial NOT NULL,
  article_id bigserial NOT NULL,
  PRIMARY KEY (user_id, article_id),
  FOREIGN KEY (article_id) REFERENCES articles (id),
  FOREIGN KEY (user_id) REFERENCES users (id)
);
CREATE TABLE user_comments
(
  user_id    bigserial NOT NULL,
  comment_id bigserial NOT NULL,
  PRIMARY KEY (user_id, comment_id),
  FOREIGN KEY (comment_id) REFERENCES comments (id),
  FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE INDEX ON articles (title);
