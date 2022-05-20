'use strict';

const {Router} = require(`express`);

const myRoutes = new Router();

myRoutes.get(`/`, (req, res) => res.render(`my`));
myRoutes.get(`/comments`, (req, res) => res.render(`comments`));
myRoutes.get(`/categories`, (req, res) => res.render(`all-categories`));

module.exports = myRoutes;
