'use strict';

const {nanoid} = require(`nanoid`);
const dayjs = require(`dayjs`);
const {MAX_ID_LENGTH} = require(`../../consts`);
const {DATE_FORMAT} = require(`../../consts`);

class ArticlesService {
  constructor(articles) {
    this._articles = articles;
  }


  create(article) {
    const newArticle = {
      ...article,
      id: nanoid(MAX_ID_LENGTH),
      comments: [],
      createdDate: dayjs(new Date()).format(DATE_FORMAT),
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
    return this._articles.map((item) => item.id === id ? article : item);
  }
}

module.exports = {
  ArticlesService
};
