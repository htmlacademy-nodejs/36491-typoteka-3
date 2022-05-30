'use strict';

const {Router} = require(`express`);

const articlesRoutes = new Router();

articlesRoutes.get(`/`, (req, res) => res.render(`post-detail`));
articlesRoutes.get(`/category/:id`, (req, res) => res.render(`articles-by-category`));
articlesRoutes.get(`/add`, (req, res) => res.render(`post`));
articlesRoutes.get(`/edit/:id`, (req, res) => res.send(`/articles/edit/:id`));
articlesRoutes.get(`/:id`, (req, res) => res.send(`/articles/:id`));

module.exports = articlesRoutes;
