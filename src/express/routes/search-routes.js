'use strict';

const {Router} = require(`express`);

const searchRoutes = new Router();

searchRoutes.get(`/`, (req, res) => res.send(`/search`));

module.exports = searchRoutes;
