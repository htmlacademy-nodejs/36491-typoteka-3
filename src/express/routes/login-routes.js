'use strict';

const {Router} = require(`express`);

const loginRoutes = new Router();

loginRoutes.get(`/`, (req, res) => res.send(`/login`));

module.exports = loginRoutes;
