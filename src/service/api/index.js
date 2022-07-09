'use strict';

const {Router} = require(`express`);
const articles = require(`./articles/articles`);
const categories = require(`./categories/categories`);
const search = require(`./search/search`);
const {getMockData} = require(`../lib/get-mock-data`);

const {ArticlesService} = require(`../data-service/articles`);
const {CategoryService} = require(`../data-service/categories`);
const {CommentsService} = require(`../data-service/comments`);
const {SearchService} = require(`../data-service/search`);

const app = new Router();

(async () => {
  const mockData = await getMockData();

  articles(app, new ArticlesService(mockData), new CommentsService(mockData));
  categories(app, new CategoryService(mockData));
  search(app, new SearchService(mockData));
})();

module.exports = app;
