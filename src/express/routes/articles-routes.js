'use strict';

const {Router} = require(`express`);
const {getAPI} = require(`../api`);

const api = getAPI();

const articlesRoutes = new Router();

articlesRoutes.get(`/`, (req, res) => res.render(`post-detail`));
articlesRoutes.get(`/category/:id`, (req, res) => res.render(`articles-by-category`));
articlesRoutes.get(`/add`, (req, res) => res.render(`post`));
articlesRoutes.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories(),
  ]);

  res.render(`edit-post`, {article, categories});
});
articlesRoutes.get(`/:id`, (req, res) => res.send(`/articles/:id`));

module.exports = articlesRoutes;
