'use strict';

const {Router} = require(`express`);
const {getAPI} = require(`../api`);
const {ARTICLES_PER_PAGE} = require(`../../consts`);

const myRoutes = new Router();
const api = getAPI();

myRoutes.get(`/`, async (req, res) => {
  // получаем номер страницы
  let {page = 1} = req.query;
  page = +page;
  // количество запрашиваемых объявлений равно количеству объявлений на странице
  const limit = ARTICLES_PER_PAGE;
  // количество объявлений, которое нам нужно пропустить - это количество объявлений на предыдущих страницах
  const offset = (page - 1) * ARTICLES_PER_PAGE;
  const [
    {count, articles},
    categories
  ] = await Promise.all([
    api.getArticles({limit, offset}),
    api.getCategories(true)
  ]);

  // количество страниц — это общее количество объявлений, поделённое на количество объявлений на странице (с округлением вверх)
  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  // передадим все эти данные в шаблон
  res.render(`main`, {articles, page, totalPages, categories});
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
