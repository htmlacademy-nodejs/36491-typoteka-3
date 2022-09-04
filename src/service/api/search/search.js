'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../../consts`);

module.exports = (app, searchService) => {
  const route = new Router();
  app.use(`/search`, route);

  route.get(`/`, async (req, res) => {
    const {q = ``} = req.query;

    if (!q) {
      return res.status(HttpCode.BAD_REQUEST).json([]);
    }

    const foundArticles = await searchService.findAll(q);
    const status = foundArticles.length > 0 ? HttpCode.OK : HttpCode.NOT_FOUND;

    return res.status(status).json(foundArticles);
  });
};
