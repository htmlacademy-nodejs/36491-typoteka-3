const {Router} = require(`express`);

const publicationsByCategoryRoutes = new Router();

publicationsByCategoryRoutes.get(`/`, (req, res) => res.render(`articles-by-category`));

module.exports = publicationsByCategoryRoutes;
