'use strict';

const express = require(`express`);
const path = require(`path`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;

const app = express();
const mainRoutes = require(`./routes/main-routes`);
const registerRoutes = require(`./routes/register-routes`);
const loginRoutes = require(`./routes/login-routes`);
const searchRoutes = require(`./routes/search-routes`);
const myRoutes = require(`./routes/my-routes`);
const articlesRoutes = require(`./routes/articles-routes`);
const postUserRoutes = require(`./routes/post-user`);
const publicationsByCategoryRoutes = require(`./routes/publications-by-category`);

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(`/`, mainRoutes);
app.use(`/register`, registerRoutes);
app.use(`/post-user`, postUserRoutes);
app.use(`/publications-by-category`, publicationsByCategoryRoutes);
app.use(`/login`, loginRoutes);
app.use(`/search`, searchRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRoutes);

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.listen(DEFAULT_PORT);
