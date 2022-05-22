'use strict';

const {Router} = require(`express`);

const mainRoutes = new Router();

mainRoutes.get(`/`, (req, res) => res.send(`/`));

module.exports = mainRoutes;
