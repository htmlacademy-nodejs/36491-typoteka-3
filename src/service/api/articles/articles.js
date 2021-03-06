'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../../consts`);
const {articleValidator} = require(`../../middlewares/articleValidator`);
const {articleExist} = require(`../../middlewares/articleExist`);
const {commentValidator} = require(`../../middlewares/commentValidator`);

module.exports = (app, articleService, commentsService) => {
  const route = new Router();
  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const articles = await articleService.findAll();

    res.status(HttpCode.OK)
      .json(articles);
  });

  route.get(`/:articleId`, articleExist(articleService), (req, res) => {
    const {article} = res.locals;

    return res.status(HttpCode.OK).json(article);
  });

  route.post(`/`, articleValidator, (req, res) => {
    const article = articleService.create(req.body);

    return res.status(HttpCode.CREATED).json(article);
  });

  route.put(`/:articleId`, [articleExist(articleService), articleValidator], (req, res) => {
    const {articleId} = req.params;
    const updatedArticle = articleService.update(articleId, req.body);

    return res.status(HttpCode.OK).json(updatedArticle);
  });

  route.delete(`/:articleId`, articleExist(articleService), (req, res) => {
    const {articleId} = req.params;

    const deletedArticle = articleService.drop(articleId);

    return res.status(HttpCode.OK).send(deletedArticle);
  });

  route.get(`/:articleId/comments`, articleExist(articleService), async (req, res) => {
    const {article} = res.locals;

    return res.status(HttpCode.OK)
      .json(article.comments);
  });

  route.delete(`/:articleId/comments/:commentId`, articleExist(articleService), (req, res) => {
    const {articleId, commentId} = req.params;

    const {comment} = commentsService.drop(articleId, commentId);

    if (!comment) {
      return res.status(HttpCode.NOT_FOUND).send(`Comment with ${commentId} not found`);
    }

    return res.status(HttpCode.OK).send(comment);
  });

  route.post(`/:articleId/comments`, [articleExist(articleService), commentValidator], (req, res) => {
    const {articleId} = req.params;

    const comment = commentsService.create(articleId, req.body.text);

    return res.status(HttpCode.CREATED).json(comment);
  });
};
