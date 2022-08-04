'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {ExitCode, FilePath, MAX_COMMENTS, DEFAULT_COUNT} = require(`../../consts`);
const {
  getRandomInt,
  shuffle,
} = require(`../../utils`);

const FILE_NAME = `fill-db.sql`;

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};
const generateComments = (count, articleId, userCount, comments) => (
  Array(count).fill({}).map(() => ({
    userId: getRandomInt(1, userCount),
    articleId,
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 2))
      .join(` `),
  }))
);
const generateArticles = (count, titles, categoryCount, userCount, sentences, comments) => (
  Array(count).fill({}).map((_, index) => ({
    category: [getRandomInt(1, categoryCount)],
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), index + 1, userCount, comments),
    announcement: shuffle(sentences).slice(1, 2).join(` `),
    photo: `picture.jpg`,
    title: titles[getRandomInt(0, titles.length - 1)],
    fullText: shuffle(sentences).slice(1, getRandomInt(1, 3)).join(` `),
    userId: getRandomInt(1, userCount)
  }))
);

module.exports = {
  name: `--fill`,
  async run(args) {
    const sentences = await readContent(FilePath.SENTENCES);
    const titles = await readContent(FilePath.TITLES);
    const categories = await readContent(FilePath.CATEGORIES);
    const commentSentences = await readContent(FilePath.COMMENTS);
    const [count] = args;
    const countArticle = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const users = [
      {
        email: `ivanov@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Иван`,
        lastName: `Иванов`,
        avatar: `avatar1.jpg`,
        role: `123`
      }, {
        email: `petrov@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Пётр`,
        lastName: `Петров`,
        avatar: `avatar2.jpg`,
        role: `321`
      }
    ];
    const articles = generateArticles(countArticle, titles, categories.length, users.length, sentences, commentSentences);
    const comments = articles.flatMap((article) => article.comments);
    const articleCategories = articles.map((article, index) => ({
      articleId: index + 1,
      categoryId: article.category[0]
    }));
    const articleComments = articles.map((article, index) => ({
      articleId: index + 1,
      commentId: article.comments[0].articleId
    }));
    const userArticles = articles.map((article, index) => ({
      userId: article.userId,
      articleId: index + 1
    }));
    const userComments = comments.map((comment, index) => ({
      userId: comment.userId,
      commentId: index + 1
    }));
    const userValues = users.map(
        ({email, passwordHash, firstName, lastName, avatar, role}) =>
          `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}', '${role}')`
    ).join(`,\n`);
    const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);
    const articleValues = articles.map(
        ({title, fullText, announcement, photo, userId}) =>
          `('${title}', '${fullText}', '${announcement}', '${photo}', '${userId}')`
    ).join(`,\n`);
    const articleCategoryValues = articleCategories.map(
        ({articleId, categoryId}) =>
          `('${articleId}', '${categoryId}')`
    ).join(`,\n`);
    const articleCommentsValues = articleComments.map(
        ({articleId, commentId}) =>
          `('${articleId}', '${commentId}')`
    ).join(`,\n`);
    const userArticlesValues = userArticles.map(
        ({userId, articleId}) =>
          `('${userId}', '${articleId}')`
    ).join(`,\n`);
    const userCommentsValues = userComments.map(
        ({userId, commentId}) =>
          `('${userId}', '${commentId}')`
    ).join(`,\n`);
    const commentValues = comments.map(
        ({text, userId, articleId}) =>
          `('${text}', '${userId}', '${articleId}')`
    ).join(`,\n`);

    const content = `
      INSERT INTO users(email, password_hash, first_name, last_name, avatar, role)
      VALUES ${userValues};
      INSERT INTO categories(name)
      VALUES ${categoryValues};

      ALTER TABLE articles DISABLE TRIGGER ALL;
      INSERT INTO articles(title, announcement, text, photo, user_id)
      VALUES ${articleValues};
      ALTER TABLE articles ENABLE TRIGGER ALL;

      ALTER TABLE article_categories DISABLE TRIGGER ALL;
      INSERT INTO article_categories(article_id, category_id)
      VALUES ${articleCategoryValues};
      ALTER TABLE article_categories ENABLE TRIGGER ALL;

      ALTER TABLE article_comments DISABLE TRIGGER ALL;
      INSERT INTO article_comments(article_id, comment_id)
      VALUES ${articleCommentsValues};
      ALTER TABLE article_comments ENABLE TRIGGER ALL;

      ALTER TABLE user_articles DISABLE TRIGGER ALL;
      INSERT INTO user_articles(user_id, article_id)
      VALUES ${userArticlesValues};
      ALTER TABLE user_articles ENABLE TRIGGER ALL;

      ALTER TABLE user_comments DISABLE TRIGGER ALL;
      INSERT INTO user_comments(user_id, comment_id)
      VALUES ${userCommentsValues};
      ALTER TABLE user_comments ENABLE TRIGGER ALL;

      ALTER TABLE comments DISABLE TRIGGER ALL;
      INSERT INTO COMMENTS(text, user_id, article_id)
      VALUES ${commentValues};
      ALTER TABLE comments ENABLE TRIGGER ALL;`;

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.info(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.error);
    }
  }
};
