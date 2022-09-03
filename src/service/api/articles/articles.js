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
    const {comments} = req.query;
    const articles = await articleService.findAll(comments);

    return res.status(HttpCode.OK)
      .json(articles);
  });

  route.get(`/:articleId`, articleExist(articleService), async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.findOne(articleId);

    return res.status(HttpCode.OK).json(article);
  });

  route.post(`/`, articleValidator, async (req, res) => {
    try {
      const article = await articleService.create(req.body);
      return res.status(HttpCode.CREATED).json(article);
    } catch (e) {
      return res.status(HttpCode.BAD_REQUEST);
    }
  });

  route.put(`/:articleId`, [articleExist(articleService), articleValidator], async (req, res) => {
    const {articleId} = req.params;
    const updatedArticle = await articleService.update(articleId, req.body);

    if (!updatedArticle) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK)
      .send(`Updated`);
  });

  route.delete(`/:articleId`, articleExist(articleService), async (req, res) => {
    const {articleId} = req.params;

    const deletedArticle = await articleService.drop(articleId);

    return res.status(HttpCode.OK).send(deletedArticle);
  });

  route.get(`/:articleId/comments`, articleExist(articleService), async (req, res) => {
    const {articleId} = req.params;
    const comments = await commentsService.findAll(articleId);

    return res.status(HttpCode.OK)
      .json(comments);
  });

  route.delete(`/:articleId/comments/:commentId`, articleExist(articleService), async (req, res) => {
    const {articleId, commentId} = req.params;

    const isCommentDelete = await commentsService.drop(articleId, commentId);

    if (!isCommentDelete) {
      return res.status(HttpCode.NOT_FOUND).send(`Comment with ${commentId} not found`);
    }

    return res.status(HttpCode.OK).send(isCommentDelete);
  });

  route.post(`/:articleId/comments`, [articleExist(articleService), commentValidator], async (req, res) => {
    const {articleId} = req.params;
    const comment = await commentsService.create(articleId, req.body);
    return res.status(HttpCode.CREATED).json(comment);
  });
};
