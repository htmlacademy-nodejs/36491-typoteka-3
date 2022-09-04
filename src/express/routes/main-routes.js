'use strict';

const {Router} = require(`express`);
const {getAPI} = require(`../api`);

const api = getAPI();

const mainRoutes = new Router();

mainRoutes.get(`/`, async (req, res) => {
  const [
    articles,
    categories
  ] = await Promise.all([
    api.getArticles(),
    api.getCategories(true) // опциональный аргумент
  ]);

  res.render(`main`, {articles, categories});
});

module.exports = mainRoutes;
