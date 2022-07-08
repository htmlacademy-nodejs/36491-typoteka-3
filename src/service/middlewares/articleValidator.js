'use strict';

const {HttpCode} = require(`../../consts`);

const articleKeys = [`announce`, `categories`, `title`, `fullText`];

const articleValidator = (req, res, next) => {
  const newArticle = req.body;
  const keys = Object.keys(newArticle);
  const keysExists = articleKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    res.status(HttpCode.BAD_REQUEST)
      .send(`Bad request`);
  }

  next();
};

module.exports = {
  articleValidator
};
