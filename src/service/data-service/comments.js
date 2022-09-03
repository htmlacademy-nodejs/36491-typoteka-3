'use strict';

class CommentsService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
  }

  async create(articleId, comment) {
    return this._Comment.create({
      articleId,
      ...comment
    });
  }

  async drop(articleId, commentId) {
    const articleByUser = await this._Comment.findOne({
      where: {
        id: articleId,
      }
    });

    if (!articleByUser) {
      return !!articleByUser;
    }

    const deletedRows = await this._Comment.destroy({
      where: {
        id: commentId
      }
    });

    return !!deletedRows;
  }

  async findAll(articleId) {
    return this._Comment.findAll({
      where: {articleId},
      raw: true
    });
  }
}

module.exports = {
  CommentsService
};
