'use strict';

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const {ensureArray} = require(`../../utils`);
const {upload} = require(`../middlewares/upload`);

const api = getAPI();

const articlesRoutes = new Router();

articlesRoutes.get(`/`, (req, res) => res.render(`post-detail`));
articlesRoutes.get(`/category/:id`, (req, res) => res.render(`articles-by-category`));
articlesRoutes.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`post`, {categories});
});
articlesRoutes.post(`/add`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;

  const newArticle = {
    announce: body.announcement,
    category: ensureArray(body.categories),
    createdDate: body.date,
    fullText: body[`full-text`],
    picture: file ? file.filename : ``,
    title: body.title,
  };

  try {
    await api.createArticle(newArticle);
    res.redirect(`/my`);
  } catch (error) {
    res.redirect(`back`);
  }
});
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
