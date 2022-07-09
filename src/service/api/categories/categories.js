'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../../consts`);

module.exports = (app, categoryService) => {
  const route = new Router();
  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const articles = await categoryService.findAll();
    res.status(HttpCode.OK)
      .json(articles);
  });
};
