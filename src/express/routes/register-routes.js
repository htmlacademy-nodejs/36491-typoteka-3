const {Router} = require(`express`);

const registerRoutes = new Router();

registerRoutes.get(`/`, (req, res) => res.render(`sign-up`));

module.exports = registerRoutes;
