'use strict';

const {HttpCode} = require(`../../consts`);

const commentKeys = [`text`];

const commentValidator = (req, res, next) => {
  const newComment = req.body;
  const keys = Object.keys(newComment);
  const keysExists = commentKeys.every((key) => keys.includes(key));

  if (!keysExists) {
    res.status(HttpCode.BAD_REQUEST).send(`Bad request`);
  }

  next();
};

module.exports = {
  commentValidator
};
