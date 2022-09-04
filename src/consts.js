'use strict';

const FILE_NAME = `mocks.json`;
const FILE_MOCKS_PATH = `./mocks.json`;
const API_PREFIX = `/api`;
const MAX_ID_LENGTH = 6;
const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const MAX_TEXT_COUNT = 1000;
const MAX_ANNOUNCE_COUNT = 250;
const MAX_TITLE_COUNT = 250;
const MAX_COMMENTS = 4;
const DEFAULT_PORT = 3000;
const DATE_FORMAT = `YYYY-MM-DD hh:mm:ss`;
const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

module.exports = {
  MAX_ID_LENGTH,
  FILE_NAME,
  DEFAULT_COUNT,
  MAX_COUNT,
  MAX_TITLE_COUNT,
  MAX_ANNOUNCE_COUNT,
  MAX_TEXT_COUNT,
  MAX_COMMENTS,
  API_PREFIX,
  DEFAULT_PORT,
  FILE_MOCKS_PATH,
  DATE_FORMAT,
  PictureRestrict,
};

module.exports.FilePath = {
  SENTENCES: `./src/data/sentences.txt`,
  TITLES: `./src/data/titles.txt`,
  CATEGORIES: `./src/data/categories.txt`,
  COMMENTS: `./src/data/comments.txt`,
};

module.exports.ExitCode = {
  error: 1,
  success: 0,
};

module.exports.HttpCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

module.exports.Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};
