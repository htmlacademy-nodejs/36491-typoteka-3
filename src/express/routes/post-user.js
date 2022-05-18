const {Router} = require(`express`);

const postUserRoutes = new Router();

postUserRoutes.get(`/`, (req, res) => res.render(`post-detail`));

module.exports = postUserRoutes;
