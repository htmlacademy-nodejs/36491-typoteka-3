'use strict';

const {Router} = require(`express`);
const {getAPI} = require(`../api`);

const myRoutes = new Router();
const api = getAPI();

myRoutes.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`my`, {articles});
});

myRoutes.get(`/categories`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`all-categories`, {categories});
});

myRoutes.get(`/comments`, async (req, res) => {
  const articles = await api.getAllComments({comments: true});
  res.render(`comments`, {articles: articles.slice(0, 3)});
});

module.exports = myRoutes;
