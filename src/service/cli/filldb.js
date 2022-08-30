'use strict';

const sequelize = require(`../lib/sequelize`);
const initDatabase = require(`../lib/init-db`);
const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {getRandomInt, shuffle} = require(`../../utils`);
const {getLogger} = require(`../lib/logger`);
const {
  MAX_TITLE_COUNT,
  MAX_ANNOUNCE_COUNT,
  MAX_TEXT_COUNT,
  FilePath,
  MAX_COMMENTS,
  DEFAULT_COUNT,
  PictureRestrict
} = require(`../../consts`);

const logger = getLogger({name: `api`});

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};
const getPictureFileName = (number) => `item${number.toString().padStart(2, 0)}.jpg`;
const getRandomSubarray = (items) => {
  items = items.slice();
  let count = getRandomInt(1, items.length - 1);
  const result = [];
  while (count--) {
    result.push(
      ...items.splice(
        getRandomInt(0, items.length - 1), 1
      )
    );
  }
  return result;
};
const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);
const generateArticles = (count, titles, categories, sentences, comments) => (
  Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)].slice(1, MAX_TITLE_COUNT),
    announcement: shuffle(sentences).slice(1, sentences.length - 1).join(` `).slice(1, MAX_ANNOUNCE_COUNT),
    text: shuffle(sentences).slice(1, getRandomInt(1, sentences.length - 1)).join(` `).slice(1, MAX_TEXT_COUNT),
    categories: getRandomSubarray(categories),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
    photo: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
  }))
);

module.exports = {
  name: `--filldb`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }
    logger.info(`Connection to database established`);

    const sentences = await readContent(FilePath.SENTENCES);
    const titles = await readContent(FilePath.TITLES);
    const categories = await readContent(FilePath.CATEGORIES);
    const comments = await readContent(FilePath.COMMENTS);

    const [count] = args;
    const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const articles = generateArticles(countArticle, titles, categories, sentences, comments);

    return initDatabase(sequelize, {articles, categories});
  }
};
