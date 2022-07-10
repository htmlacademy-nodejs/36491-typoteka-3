'use strict';

const {Router} = require(`express`);
const {getAPI} = require(`../api`);

const api = getAPI();

const mainRoutes = new Router();

mainRoutes.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`main`, {articles});
});

module.exports = mainRoutes;
