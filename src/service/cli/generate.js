'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const dayjs = require(`dayjs`);
const {nanoid} = require(`nanoid`);
const dayjsRandom = require(`dayjs-random`);
const {ExitCode, FilePath, MAX_ID_LENGTH, MAX_COMMENTS, DEFAULT_COUNT, MAX_COUNT, FILE_NAME} = require(`../../consts`);
const {
  getRandomInt,
  shuffle,
} = require(`../../utils`);

dayjs.extend(dayjsRandom);

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};
const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);
const generateArticles = (count, titles, categories, sentences, comments) => (
  Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: dayjs.between(dayjs().subtract(3, `month`), dayjs()).format(`YYYY-MM-DD hh:mm:ss`),
    announce: shuffle(sentences).slice(1, 5).join(` `),
    fullText: shuffle(sentences).slice(1, getRandomInt(1, sentences.length - 1)).join(` `),
    category: [categories[getRandomInt(0, categories.length - 1)]],
    id: nanoid(MAX_ID_LENGTH),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments),
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const sentences = await readContent(FilePath.SENTENCES);
    const titles = await readContent(FilePath.TITLES);
    const categories = await readContent(FilePath.CATEGORIES);
    const comments = await readContent(FilePath.COMMENTS);
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countOffer <= MAX_COUNT) {
      try {
        const content = JSON.stringify(generateArticles(countOffer, titles, categories, sentences, comments));
        await fs.writeFile(FILE_NAME, content);
        console.info(chalk.green(`Operation success. File created.`));
      } catch (err) {
        console.info(chalk.red(`Can't write data to file...`));
        process.exit(ExitCode.error);
      }
    } else {
      console.info(chalk.red(`Не больше 1000 публикаций`));
      process.exit(ExitCode.error);
    }
  }
};
