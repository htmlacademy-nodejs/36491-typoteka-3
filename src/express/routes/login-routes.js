const {Router} = require(`express`);

const loginRoutes = new Router();

loginRoutes.get(`/`, (req, res) => res.render(`login`));

module.exports = loginRoutes;
