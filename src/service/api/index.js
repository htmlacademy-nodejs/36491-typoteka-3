'use strict';

const {Router} = require(`express`);

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);

const articles = require(`./articles/articles`);
const categories = require(`./categories/categories`);

const search = require(`./search/search`);
const {ArticlesService} = require(`../data-service/articles`);
const {CategoryService} = require(`../data-service/categories`);
const {CommentsService} = require(`../data-service/comments`);
const {SearchService} = require(`../data-service/search`);

const app = new Router();

defineModels(sequelize);

(async () => {
  articles(app, new ArticlesService(sequelize), new CommentsService(sequelize));
  categories(app, new CategoryService(sequelize));
  search(app, new SearchService(sequelize));
})();

module.exports = app;
