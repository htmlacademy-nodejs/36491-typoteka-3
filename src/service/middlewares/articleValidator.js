'use strict';

const {HttpCode} = require(`../../consts`);

const articleKeys = [`announcement`, `categories`, `title`, `text`, `photo`];

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
