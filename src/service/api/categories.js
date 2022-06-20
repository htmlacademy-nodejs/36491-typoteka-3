'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../consts`);

const route = new Router();

module.exports = (app, categoryService) => {
  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const articles = await categoryService.findAll();
    res.status(HttpCode.OK)
      .json(articles);
  });
};
