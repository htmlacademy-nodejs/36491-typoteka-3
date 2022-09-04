'use strict';

const {Router} = require(`express`);

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);

const articles = require(`./articles/articles`);
const category = require(`./category/category`);

const search = require(`./search/search`);
const {ArticlesService} = require(`../data-service/articles`);
const {CategoryService} = require(`../data-service/category`);
const {CommentsService} = require(`../data-service/comments`);
const {SearchService} = require(`../data-service/search`);

const app = new Router();

defineModels(sequelize);

(async () => {
  articles(app, new ArticlesService(sequelize), new CommentsService(sequelize));
  category(app, new CategoryService(sequelize));
  search(app, new SearchService(sequelize));
})();

module.exports = app;
