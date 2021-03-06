'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../consts`);

class ArticlesService {
  constructor(articles) {
    this._articles = articles;
  }

  create(article) {
    const newArticle = {
      ...article,
      id: nanoid(MAX_ID_LENGTH),
      comments: [],
    };

    this._articles.push(newArticle);
    return newArticle;
  }

  drop(id) {
    let article = null;

    this._articles = this._articles.filter((item) => {
      if (item.id === id) {
        article = item;
      }

      return item.id !== id;
    });

    return article;
  }

  findAll() {
    return this._articles;
  }

  findOne(id) {
    return this._articles.find((item) => item.id === id);
  }

  update(id, article) {
    let newArticle = null;

    this._articles = this._articles.map((item) => {
      if (item.id === id) {
        newArticle = {...item, ...article};
        return newArticle;
      }

      return item;
    });

    return newArticle;
  }
}

module.exports = {
  ArticlesService
};
